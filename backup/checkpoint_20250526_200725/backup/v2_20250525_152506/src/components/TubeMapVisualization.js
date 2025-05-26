import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const TubeMapVisualization = ({
  portOperations,
  cargoTypes,
  activePort,
  activeCharterer,
  showTimestamps,
  focusTimeType,
  greyOutNonUnilever
}) => {
  const svgRef = useRef();
  const [containerWidth, setContainerWidth] = useState(1000);

  // Handle responsive resizing
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current && svgRef.current.parentElement) {
        setContainerWidth(svgRef.current.parentElement.clientWidth);
      }
    };

    // Initial measurement
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    // Helper function to determine if a cargo is loading or discharging at a port
    const getCargoOperationType = (cargoId, portName, portData) => {
      // Check timeline events for loading/discharging indicators
      for (const event of portData.timeline) {
        if (event.cargo === cargoId || (event.activeCargoes && event.activeCargoes.includes(cargoId))) {
          const eventLower = event.event.toLowerCase();
          if (eventLower.includes('loading') || eventLower.includes('load')) {
            return 'loading';
          }
          if (eventLower.includes('discharging') || eventLower.includes('discharge')) {
            return 'discharging';
          }
        }
      }
      
      // Fallback: check cargo data
      const cargo = cargoTypes[cargoId];
      if (cargo) {
        if (cargo.loadPort === portName) return 'loading';
        if (cargo.dischargePort === portName) return 'discharging';
      }
      
      return 'unknown';
    };

    // Process data for visualization with dynamic spacing and centralized cargo flow
    const processPortData = (containerWidth = 1000) => {
      const processedPorts = {};
      let currentY = 50;

      // If a specific port is selected, process only that port and position it at the top
      const portsToProcess = activePort !== 'all' 
        ? [[activePort, portOperations[activePort]]]
        : Object.entries(portOperations);

      portsToProcess.forEach(([portName, portData]) => {
        // Reset Y position for focused port to start at top
        if (activePort !== 'all' && portName === activePort) {
          currentY = 50; // Start at the top
        }

        // Helper function to estimate number of text lines
        const estimateTextLines = (text, maxWidth = 400) => {
          const avgCharWidth = 7; // Approximate character width for 12px font
          const textWidth = text.length * avgCharWidth;
          const lines = Math.ceil(textWidth / maxWidth);
          return Math.min(3, lines); // Cap at 3 lines
        };

        // Determine spacing for each event based on its importance and dynamic text wrapping
        const getEventSpacing = (event, index, events) => {
          const isLastEvent = index === events.length - 1;
          
          // For operations events that might wrap dynamically, assume worst case (3 lines)
          let estimatedLines = estimateTextLines(event.event);
          if (event.event.includes('Operations')) {
            // Operations events are likely to be wrapped to avoid cargo lines
            estimatedLines = Math.max(estimatedLines, 3);
          }
          
          const lineHeight = 16; // Height per line of text
          const textBlockHeight = estimatedLines * lineHeight;
          
          // Base spacing components
          const minSpacing = 50; // Increased minimum space between events
          const stationRadius = 12; // Space for the station circle
          const textPadding = 30; // Increased padding above and below text
          const timestampSpace = event.time ? 20 : 0; // Space for timestamp if shown
          const durationSpace = (event.duration && event.duration !== '0m' && event.duration !== 'ongoing') ? 20 : 0;
          
          // Calculate total spacing needed
          const totalTextSpace = textBlockHeight + timestampSpace + durationSpace + textPadding;
          const baseSpacing = minSpacing + stationRadius * 2 + totalTextSpace;
          
          // Major operational events get extra space
          if (event.event.includes('Operations Start') || 
              event.event.includes('Operations Complete') ||
              event.event.includes('Arrival') ||
              event.event.includes('Departure') ||
              event.event.includes('COSP')) {
            return baseSpacing + 40; // Increased extra space for major events
          }
          
          // Cargo-specific events get medium extra space
          if (event.type === 'individual') {
            return baseSpacing + 30; // Increased extra space for individual events
          }
          
          // Administrative events get base spacing
          return baseSpacing;
        };

        // Calculate Y positions with dynamic spacing
        const portEvents = portData.timeline.map((event, index) => {
          const spacing = index === 0 ? 0 : getEventSpacing(portData.timeline[index - 1], index - 1, portData.timeline);
          if (index === 0) {
            currentY += 100; // Increased initial offset for first event
          } else {
            currentY += spacing;
          }
          
          return {
            ...event,
            id: `${portName}-${index}`,
            portName,
            y: currentY
          };
        });

        // Enhanced cargo positioning with loading/discharging separation
        const enrichedEvents = portEvents.map((event, eventIndex) => {
          const activeCargoes = event.activeCargoes || [];
          
          // Dynamic center calculation based on container width and screen size
          const responsiveMargin = Math.max(50, containerWidth * 0.05);
          const usableWidth = containerWidth - (2 * responsiveMargin);
          
          // Shift the entire visualization to the left to create more space on the right
          // This helps prevent text truncation at the right edge
          const leftShift = Math.min(150, containerWidth * 0.1); // Shift left by 10% or max 150px
          
          // Determine which cargoes have operations at this port
          const portCargoes = new Set();
          portData.timeline.forEach(e => {
            if (e.activeCargoes) {
              e.activeCargoes.forEach(cargoId => portCargoes.add(cargoId));
            }
          });
          
          // Separate cargoes by operation type
          const loadingCargoes = [];
          const dischargingCargoes = [];
          
          Array.from(portCargoes).forEach(cargoId => {
            const opType = getCargoOperationType(cargoId, portName, portData);
            if (opType === 'loading') {
              loadingCargoes.push(cargoId);
            } else if (opType === 'discharging') {
              dischargingCargoes.push(cargoId);
            }
          });
          
          // Sort for consistent ordering
          loadingCargoes.sort();
          dischargingCargoes.sort();
          
          // Calculate adaptive center position based on cargo distribution
          const totalLoading = loadingCargoes.length;
          const totalDischarging = dischargingCargoes.length;
          const totalCargoes = totalLoading + totalDischarging;
          
          // Adaptive center that shifts based on cargo distribution
          let centerX;
          if (totalLoading === 0) {
            // Only discharging - shift center left to maximize right space
            centerX = responsiveMargin + (usableWidth * 0.25) - leftShift; // Shifted more left
          } else if (totalDischarging === 0) {
            // Only loading - shift center right to maximize left space
            centerX = responsiveMargin + (usableWidth * 0.65) - leftShift; // Still shifted left overall
          } else {
            // Mixed - position center based on ratio
            const loadingRatio = totalLoading / totalCargoes;
            centerX = responsiveMargin + (usableWidth * (0.25 + (0.35 * loadingRatio))) - leftShift; // Shifted left
          }
          
          // Create cargo positions map
          const cargoPositions = {};
          
          // Determine if this cargo is currently in individual operations phase
          const isInOperationsPhase = (cargoId) => {
            // Find the start and end of operations for this cargo
            let operationsStart = null;
            let operationsEnd = null;
            
            // Look for operation start events (more comprehensive pattern matching)
            for (let i = 0; i < portData.timeline.length; i++) {
              const e = portData.timeline[i];
              if (e.cargo === cargoId && (
                e.event.includes('Operations Start') || 
                e.event.includes('Hose Connected') || 
                e.event.includes('Loading Commenced') || 
                e.event.includes('Discharging Commenced') ||
                e.event.includes('Discharge Commenced') ||
                e.event.includes('Loading Started') ||
                e.event.includes('Discharge Started') ||
                // Additional patterns found in the data
                e.event.includes('Loading Commences') ||
                e.event.includes('Discharging Commences')
              )) {
                operationsStart = i;
                break;
              }
            }
            
            // Look for operation end events  
            for (let i = portData.timeline.length - 1; i >= 0; i--) {
              const e = portData.timeline[i];
              if (e.cargo === cargoId && (
                e.event.includes('Operations Complete') ||
                e.event.includes('Operations Completed') ||
                e.event.includes('Loading Complete') ||
                e.event.includes('Discharge Complete') ||
                e.event.includes('Discharging Complete')
              )) {
                operationsEnd = i;
                break;
              }
            }
            
            // CRITICAL FIX: If we found operations for this cargo, it should branch during those operations
            // This enforces the rule that ALL cargoes must branch during operations
            if (operationsStart !== null && operationsEnd !== null) {
              return eventIndex >= operationsStart && eventIndex <= operationsEnd;
            }
            
            // ADDITIONAL FIX: For cargoes that have individual operations events but no clear start/end,
            // check if this specific event is an individual operation for this cargo
            const currentEvent = portData.timeline[eventIndex];
            if (currentEvent && currentEvent.type === 'individual' && currentEvent.cargo === cargoId) {
              return true;
            }
            
            // NEW RULE: If this cargo has ANY individual operations at this port,
            // and we're in a phase where it's actively being worked on (in activeCargoes),
            // it should branch out to signal operations are happening
            const hasIndividualOpsAtPort = portData.timeline.some(ev => 
              ev.type === 'individual' && ev.cargo === cargoId
            );
            
            if (hasIndividualOpsAtPort && portData.timeline[eventIndex]?.activeCargoes?.includes(cargoId)) {
              // Check if we're in an operational timeframe (not just waiting)
              const currentEvent = portData.timeline[eventIndex];
              if (currentEvent && currentEvent.timeType === 'laytime' && currentEvent.type === 'individual') {
                return true;
              }
            }
            
            return false;
          };
          
          // Responsive spacing calculation with enforced minimum
          const getResponsiveSpacing = (numCargoes, availableSpace) => {
            const minSpacing = 80; // Enforced minimum spacing to prevent overlaps
            const idealSpacing = 100; // Ideal spacing for clarity
            const maxSpacing = 150; // Maximum spacing
            
            // Calculate what spacing we can afford with available space
            const possibleSpacing = availableSpace / (numCargoes + 1);
            
            // Ensure we never go below minimum spacing (per design rule #16)
            const actualSpacing = Math.max(minSpacing, Math.min(maxSpacing, possibleSpacing));
            
            return actualSpacing;
          };
          
          // Position all cargoes
          const allCargoes = [...loadingCargoes, ...dischargingCargoes];
          
          allCargoes.forEach((cargoId) => {
            const isLoading = loadingCargoes.includes(cargoId);
            const cargoIndex = isLoading ? loadingCargoes.indexOf(cargoId) : dischargingCargoes.indexOf(cargoId);
            const groupSize = isLoading ? totalLoading : totalDischarging;
            const isCurrentlyInOperations = isInOperationsPhase(cargoId);
            
            if (isCurrentlyInOperations) {
              // Branch out for operations
              let targetX;
              
              if (totalCargoes === 1) {
                // Single cargo: branch based on operation type
                targetX = isLoading ? centerX - 150 : centerX + 150;
              } else {
                // Multiple cargoes: position based on loading/discharging side
                const availableSpace = isLoading ? 
                  (centerX - responsiveMargin) : 
                  (containerWidth - responsiveMargin - centerX);
                
                const spacing = getResponsiveSpacing(groupSize, availableSpace);
                
                if (isLoading) {
                  // Loading cargoes on the left
                  // Position cargoes to the left of center with proper spacing
                  targetX = centerX - spacing - (cargoIndex * spacing);
                } else {
                  // Discharging cargoes on the right
                  // Position cargoes to the right of center with proper spacing
                  targetX = centerX + spacing + (cargoIndex * spacing);
                }
              }
              
              cargoPositions[cargoId] = {
                x: Math.max(responsiveMargin, Math.min(containerWidth - responsiveMargin, targetX)),
                inBundle: false,
                isActive: true,
                isCentralized: false,
                isCurrentlyOperating: activeCargoes.includes(cargoId),
                isInOperations: true,
                cargoIndex: cargoIndex,
                side: isLoading ? 'left' : 'right',
                operationType: isLoading ? 'loading' : 'discharging'
              };
            } else {
              // Not in operations - stay centralized with small offsets
              const offsetSpacing = Math.min(12, 100 / totalCargoes);
              const totalOffset = (totalCargoes - 1) * offsetSpacing;
              const overallIndex = allCargoes.indexOf(cargoId);
              const cargoOffset = (overallIndex * offsetSpacing) - (totalOffset / 2);
              
              cargoPositions[cargoId] = {
                x: centerX + cargoOffset,
                inBundle: true,
                isActive: true,
                isCentralized: true,
                isCurrentlyOperating: activeCargoes.includes(cargoId),
                isInOperations: false,
                cargoIndex: overallIndex,
                operationType: isLoading ? 'loading' : 'discharging'
              };
            }
          });

          // Validate positions to ensure no overlaps during operations
          const operationalCargoes = allCargoes.filter(cargoId => 
            cargoPositions[cargoId]?.isInOperations
          );
          
          // Check for position conflicts and adjust if needed
          if (operationalCargoes.length > 1) {
            const positionMap = new Map();
            
            operationalCargoes.forEach(cargoId => {
              const pos = cargoPositions[cargoId];
              const roundedX = Math.round(pos.x);
              
              // Check if another cargo is already at this position
              if (positionMap.has(roundedX)) {
                // Conflict detected - adjust position
                const conflictingCargo = positionMap.get(roundedX);
                console.warn(`Position conflict detected between ${cargoId} and ${conflictingCargo} at x=${roundedX}`);
                
                // Move the cargo slightly to avoid overlap
                const adjustment = pos.side === 'right' ? 85 : -85; // Minimum spacing
                pos.x += adjustment;
              } else {
                positionMap.set(roundedX, cargoId);
              }
            });
          }

          // Calculate bundle metrics for shared operations
          const activeBundledCargoes = allCargoes.filter(cargoId => 
            cargoPositions[cargoId]?.inBundle
          );
          const bundleWidth = Math.max(40, activeBundledCargoes.length * 8);
          
          return {
            ...event,
            cargoPositions,
            bundleWidth,
            bundleStartX: centerX - (bundleWidth / 2),
            hasBreakout: allCargoes.some(cargoId => cargoPositions[cargoId]?.isInOperations),
            centerX,
            totalPortCargoes: totalCargoes,
            responsiveMargin,
            usableWidth
          };
        });

        processedPorts[portName] = {
          ...portData,
          events: enrichedEvents,
          startY: enrichedEvents.length > 0 ? enrichedEvents[0].y - 80 : currentY,
          endY: enrichedEvents.length > 0 ? enrichedEvents[enrichedEvents.length - 1].y + 120 : currentY // Increased padding for final event
        };

        currentY += 200; // Increased spacing between ports
      });

      return processedPorts;
    };

    // Generate cargo line paths with centralized flow and smart breakouts
    const generateCargoPath = (cargoId, events) => {
      const pathSegments = [];
      let previousPosition = null;

      events.forEach((event, index) => {
        const position = event.cargoPositions[cargoId];
        if (!position) return;

        const x = position.x;
        const y = event.y;

        if (previousPosition) {
          const dx = x - previousPosition.x;
          const dy = y - previousPosition.y;
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);
          
          // Determine transition type
          const isInOperations = position.isInOperations;
          const wasInOperations = previousPosition.isInOperations;
          const isTransitionToOperations = !wasInOperations && isInOperations;
          const isTransitionFromOperations = wasInOperations && !isInOperations;
          const isDuringOperations = isInOperations && wasInOperations;
          
          if (isDuringOperations && absDx < 10) {
            // Straight vertical line during operations - no deviation
            pathSegments.push(`L ${x} ${y}`);
          } else if (absDx < 5) {
            // Nearly vertical - use straight line
            pathSegments.push(`L ${x} ${y}`);
          } else if (isTransitionToOperations || isTransitionFromOperations) {
            // Smooth transition into/out of operations using constrained angles
            const transitionDistance = Math.min(absDy * 0.4, 60);
            const midY = previousPosition.y + transitionDistance;
            const endMidY = y - transitionDistance;
            
            // Create clean angular transition
            if (absDy > 40) {
              // Multi-segment transition for better visual flow
              pathSegments.push(
                `L ${previousPosition.x} ${midY}`,
                `L ${x} ${endMidY}`,
                `L ${x} ${y}`
              );
            } else {
              // Simple angled transition
              pathSegments.push(`L ${x} ${y}`);
            }
          } else {
            // Standard transitions between centralized positions
            if (absDx > 20) {
              // Larger horizontal movement - use stepped path
              const midY = previousPosition.y + (dy * 0.6);
              pathSegments.push(
                `L ${previousPosition.x} ${midY}`,
                `L ${x} ${midY}`,
                `L ${x} ${y}`
              );
            } else {
              // Small movement - direct line
              pathSegments.push(`L ${x} ${y}`);
            }
          }
        } else {
          pathSegments.push(`M ${x} ${y}`);
        }

        previousPosition = { 
          x, 
          y, 
          isInOperations: position.isInOperations,
          side: position.side,
          cargoIndex: position.cargoIndex
        };
      });

      return pathSegments.join(' ');
    };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Process port data with actual container width from state
    const processedPorts = processPortData(containerWidth);
    
    // Calculate total height - maintain consistent height to prevent page jumps
    let totalHeight;
    if (activePort === 'all') {
      // For all ports, calculate based on actual content
      totalHeight = Math.max(800, Object.values(processedPorts).reduce(
        (acc, port) => Math.max(acc, port.endY + 150), 100
      ));
    } else {
      // For individual ports, use a fixed height to prevent page jumping
      // This ensures the page doesn't shift when switching between port views
      totalHeight = 1200; // Fixed height that accommodates any single port
    }

    svg.attr('width', containerWidth).attr('height', totalHeight);

    // Add viewBox to ensure content is not clipped
    svg.attr('viewBox', `0 0 ${containerWidth} ${totalHeight}`)
       .attr('preserveAspectRatio', 'xMinYMin meet');

    // Add patterns for time type backgrounds
    const defs = svg.append('defs');
    
    // Waiting pattern
    const waitingPattern = defs.append('pattern')
      .attr('id', 'waitingPattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4);
    waitingPattern.append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#f39c12')
      .attr('stroke-width', 1);

    // Deduction pattern
    const deductionPattern = defs.append('pattern')
      .attr('id', 'deductionPattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4);
    deductionPattern.append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#e74c3c')
      .attr('stroke-width', 1);

    // Render each port
    Object.entries(processedPorts).forEach(([portName, portData]) => {
      const portGroup = svg.append('g').attr('class', `port-${portName.replace(/\s+/g, '-')}`);

      // Port title - positioned at left margin
      portGroup.append('text')
        .attr('x', 30) // Reduced from 50 to give more space
        .attr('y', portData.startY - 20)
        .attr('class', 'port-title')
        .style('font-size', '18px')
        .style('font-weight', '700')
        .style('fill', portData.theme)
        .text(`${portName}, ${portData.country}`);
      
      // Add loading/discharging indicators for ports with operations
      const firstEvent = portData.events[0];
      if (firstEvent && firstEvent.totalPortCargoes > 0) {
        const hasLoading = portData.timeline.some(e => 
          e.event && (e.event.toLowerCase().includes('loading') || e.event.toLowerCase().includes('load'))
        );
        const hasDischarging = portData.timeline.some(e => 
          e.event && (e.event.toLowerCase().includes('discharging') || e.event.toLowerCase().includes('discharge'))
        );
        
        if (hasLoading) {
          portGroup.append('text')
            .attr('x', firstEvent.centerX - firstEvent.usableWidth * 0.35)
            .attr('y', portData.startY + 20)
            .attr('class', 'operation-label')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', '#ff6600')
            .style('text-anchor', 'middle')
            .text('← LOADING');
        }
        
        if (hasDischarging) {
          portGroup.append('text')
            .attr('x', firstEvent.centerX + firstEvent.usableWidth * 0.35)
            .attr('y', portData.startY + 20)
            .attr('class', 'operation-label')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', '#2196f3')
            .style('text-anchor', 'middle')
            .text('DISCHARGING →');
        }
      }

      // Time type backgrounds
      portData.events.forEach((event, index) => {
        if (focusTimeType !== 'all' && focusTimeType !== event.timeType) return;

        const backgroundHeight = 60;
        const backgroundY = event.y - 30;

        portGroup.append('rect')
          .attr('class', `time-background ${event.timeType}`)
          .attr('x', 20) // Reduced from 50 to give more space
          .attr('y', backgroundY)
          .attr('width', containerWidth - 40) // Adjusted to match new margins
          .attr('height', backgroundHeight)
          .attr('rx', 8);
      });

      // Station backgrounds for shared operations
      portData.events.forEach(event => {
        if (event.type === 'shared') {
          const backgroundWidth = event.bundleWidth + 40;
          portGroup.append('rect')
            .attr('class', 'station-background')
            .attr('x', event.bundleStartX - 20)
            .attr('y', event.y - 20)
            .attr('width', backgroundWidth)
            .attr('height', 40);
        }
      });

      // Cargo lines with centralized flow and breakouts
      // Sort cargo entries for consistent z-ordering
      const sortedCargoEntries = Object.entries(cargoTypes).sort((a, b) => a[0].localeCompare(b[0]));
      
      sortedCargoEntries.forEach(([cargoId, cargoInfo]) => {
        if (activeCharterer !== 'all' && activeCharterer !== cargoInfo.charterer) return;

        // Check if this cargo has ANY operations at this port
        const hasOperationsAtPort = portData.events.some(e => 
          e.activeCargoes && e.activeCargoes.includes(cargoId)
        );

        if (!hasOperationsAtPort) return; // Skip cargoes that don't operate at this port

        // Include ALL events for this port (so cargo lines are visible throughout)
        const eventsForCargo = portData.events.filter(e => 
          e.cargoPositions && e.cargoPositions[cargoId]
        );

        if (eventsForCargo.length === 0) return;

        const pathData = generateCargoPath(cargoId, eventsForCargo);
        
        // Determine line style based on cargo activity in this port
        const hasBreakout = eventsForCargo.some(e => e.hasBreakout && e.cargo === cargoId);
        const hasCurrentOperations = eventsForCargo.some(e => 
          e.cargoPositions[cargoId] && e.cargoPositions[cargoId].isCurrentlyOperating
        );
        
        // Enhanced CSS class assignment based on cargo operational status
        let cssClasses = [`cargo-line`];
        
        // Use cargo hold designation instead of SOF format for CSS classes
        const cargoHoldClass = cargoInfo.cargoHold ? 
          `cargo-${cargoInfo.cargoHold.replace(/[^a-zA-Z0-9]/g, '-')}` : 
          `cargo-${cargoId}`;
        cssClasses.push(cargoHoldClass);
        
        if (hasBreakout) {
          cssClasses.push('has-breakout');
        } else {
          cssClasses.push('centralized');
        }
        
        if (hasOperationsAtPort) {
          cssClasses.push('port-active');
        }
        
        if (hasCurrentOperations) {
          cssClasses.push('currently-operating');
        }
        
        portGroup.append('path')
          .attr('class', cssClasses.join(' '))
          .attr('d', pathData)
          .attr('stroke', greyOutNonUnilever && cargoInfo.charterer !== 'UNILEVER' ? '#999' : cargoInfo.color)
          .attr('stroke-width', hasBreakout ? 8 : 6)
          .attr('fill', 'none')
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')
          .style('transition', 'all 0.3s ease');
      });

      // Stations (circles) with enhanced positioning
      portData.events.forEach(event => {
        const stationGroup = portGroup.append('g').attr('class', 'station-group');

        if (event.type === 'shared') {
          // Shared station - positioned at the central spine
          stationGroup.append('circle')
            .attr('class', 'station station-shared')
            .attr('cx', event.centerX)
            .attr('cy', event.y)
            .attr('r', 12)
            .attr('fill', 'rgba(52, 73, 94, 0.8)')
            .attr('stroke', '#2c3e50')
            .attr('stroke-width', 2);
          
          // Add central spine indicator
          stationGroup.append('circle')
            .attr('class', 'station-spine')
            .attr('cx', event.centerX)
            .attr('cy', event.y)
            .attr('r', 4)
            .attr('fill', '#fff');
        } else {
          // Individual station - positioned at breakout location
          const cargoInfo = cargoTypes[event.cargo];
          if (cargoInfo) {
            const position = event.cargoPositions[event.cargo];
            stationGroup.append('circle')
              .attr('class', 'station station-individual')
              .attr('cx', position.x)
              .attr('cy', event.y)
              .attr('r', 10)
              .attr('fill', greyOutNonUnilever && cargoInfo.charterer !== 'UNILEVER' ? '#999' : cargoInfo.color)
              .attr('stroke', '#fff')
              .attr('stroke-width', 2);
          }
        }

        // Station label with improved positioning
        const labelX = event.type === 'shared' 
          ? event.centerX + 20 
          : (event.cargoPositions[event.cargo]?.x || event.centerX) + 20;
        
        // Calculate available space for text
        const availableSpaceRight = containerWidth - labelX - 20;
        const availableSpaceLeft = labelX - 40;
        
        // Determine if we should position text on the left side
        const positionOnLeft = availableSpaceRight < 200 && availableSpaceLeft > 250;
        
        // Determine text positioning and wrapping - MOVED BEFORE wrapText function
        const textX = positionOnLeft ? labelX - 40 : labelX;
        const textAnchor = positionOnLeft ? 'end' : 'start';
        const maxTextWidth = Math.min(350, positionOnLeft ? availableSpaceLeft - 20 : availableSpaceRight - 20);
        
        // Helper function to wrap text
        const wrapText = (text, maxWidth, maxLines = 3) => {
          const words = text.split(' ');
          const lines = [];
          let currentLine = '';
          
          // More accurate character width calculation based on font size
          const fontSize = 12;
          const avgCharWidth = fontSize * 0.55; // Slightly reduced for better accuracy
          
          words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = testLine.length * avgCharWidth;
            
            if (testWidth > maxWidth && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });
          
          if (currentLine) {
            lines.push(currentLine);
          }
          
          // Limit to maxLines
          if (lines.length > maxLines) {
            // Combine last lines and add ellipsis
            const keptLines = lines.slice(0, maxLines - 1);
            const remainingText = lines.slice(maxLines - 1).join(' ');
            const lastLine = remainingText.length > 40 ? 
              remainingText.substring(0, 37) + '...' : 
              remainingText;
            keptLines.push(lastLine);
            return keptLines;
          }
          
          // If we still have very long lines, force break them
          const finalLines = [];
          lines.forEach(line => {
            if (line.length * avgCharWidth > maxWidth && line.length > 20) {
              // Break long lines at logical points (parentheses, dashes, etc.)
              const breakPoints = [' (', ' -', ', ', ' / ', ': '];
              let broken = false;
              
              for (const breakPoint of breakPoints) {
                const breakIndex = line.lastIndexOf(breakPoint);
                if (breakIndex > 10 && breakIndex < line.length - 5) {
                  finalLines.push(line.substring(0, breakIndex + (breakPoint === ' (' ? 0 : breakPoint.length)));
                  finalLines.push(line.substring(breakIndex + (breakPoint === ' (' ? 1 : breakPoint.length)));
                  broken = true;
                  break;
                }
              }
              
              if (!broken) {
                // Force break at max width
                const maxChars = Math.floor(maxWidth / avgCharWidth);
                finalLines.push(line.substring(0, maxChars));
                if (line.length > maxChars) {
                  finalLines.push(line.substring(maxChars));
                }
              }
            } else {
              finalLines.push(line);
            }
          });
          
          // Ensure we don't exceed maxLines after breaking
          return finalLines.slice(0, maxLines);
        };
        
        // Helper function to replace SOF identifiers with cargo hold designations in event text
        const replaceSOFWithCargoHold = (eventText, cargoId) => {
          if (!cargoId || !cargoTypes[cargoId]) return eventText;
          
          const cargoHold = cargoTypes[cargoId].cargoHold;
          // Replace SOF1, SOF2, etc. with the actual cargo hold designation
          return eventText.replace(new RegExp(`\\b${cargoId}\\b`, 'g'), cargoHold);
        };

        // Helper function to dynamically wrap text to avoid cargo line intersections
        const dynamicWrapText = (text, event, textX, textAnchor, maxWidth) => {
          // First, get all active cargo positions for this event
          const activeCargoPositions = [];
          if (event.cargoPositions) {
            Object.entries(event.cargoPositions).forEach(([cargoId, position]) => {
              if (position.isActive && !position.isCentralized) {
                activeCargoPositions.push({
                  cargoId,
                  x: position.x,
                  side: position.side
                });
              }
            });
          }
          
          // Calculate text bounds
          const fontSize = 12;
          const avgCharWidth = fontSize * 0.55;
          const lineHeight = 16;
          const textStartY = event.y - 8; // Text baseline position
          
          // Check if text would intersect with any cargo lines
          const checkIntersection = (textLines) => {
            const textWidth = Math.max(...textLines.map(line => line.length * avgCharWidth));
            const textEndX = textAnchor === 'start' ? textX + textWidth : textX - textWidth;
            const textMinX = Math.min(textX, textEndX);
            const textMaxX = Math.max(textX, textEndX);
            
            // Check each cargo line
            for (const cargo of activeCargoPositions) {
              // Check if cargo line X position falls within text bounds
              if (cargo.x >= textMinX - 10 && cargo.x <= textMaxX + 10) {
                // Check vertical intersection
                const textHeight = textLines.length * lineHeight;
                const textMinY = textStartY - textHeight / 2;
                const textMaxY = textStartY + textHeight / 2;
                
                // The cargo line passes through this Y position
                if (event.y >= textMinY && event.y <= textMaxY) {
                  return true; // Intersection detected
                }
              }
            }
            return false;
          };
          
          // Smart text breaking for operations events
          if (text.includes('Operations')) {
            // Try different breaking strategies
            const strategies = [
              // Strategy 1: Break after comma if present
              () => {
                const commaIndex = text.indexOf(',');
                if (commaIndex > 0) {
                  const beforeComma = text.substring(0, commaIndex + 1).trim();
                  const afterComma = text.substring(commaIndex + 1).trim();
                  
                  // Further break "Operations Start" if needed
                  if (afterComma.includes('Operations')) {
                    const opsIndex = afterComma.indexOf('Operations');
                    if (opsIndex > 0) {
                      return [
                        beforeComma,
                        afterComma.substring(0, opsIndex).trim(),
                        afterComma.substring(opsIndex).trim()
                      ].filter(line => line.length > 0);
                    } else {
                      const words = afterComma.split(' ');
                      if (words.length >= 2) {
                        return [
                          beforeComma,
                          words[0],
                          words.slice(1).join(' ')
                        ];
                      }
                    }
                  }
                  return [beforeComma, afterComma];
                }
                return null;
              },
              // Strategy 2: Break before "Operations"
              () => {
                const opsIndex = text.indexOf('Operations');
                if (opsIndex > 0) {
                  const beforeOps = text.substring(0, opsIndex).trim();
                  const opsAndAfter = text.substring(opsIndex).trim();
                  
                  // Further break "Operations Start/Complete" if needed
                  const opsWords = opsAndAfter.split(' ');
                  if (opsWords.length >= 2 && checkIntersection([beforeOps, opsAndAfter])) {
                    return [
                      beforeOps,
                      opsWords[0],
                      opsWords.slice(1).join(' ')
                    ];
                  }
                  
                  return [beforeOps, opsAndAfter];
                }
                return null;
              },
              // Strategy 3: Break at each major word for maximum vertical compression
              () => {
                // For patterns like "5S, 6P Operations Start"
                const parts = text.split(/[\s,]+/).filter(p => p.length > 0);
                if (parts.length >= 3) {
                  // Group cargo identifiers together, then break operations
                  const cargoPattern = /^\d+[A-Z]$/;
                  const cargoParts = [];
                  let i = 0;
                  
                  // Collect cargo identifiers
                  while (i < parts.length && cargoPattern.test(parts[i])) {
                    cargoParts.push(parts[i]);
                    i++;
                  }
                  
                  if (cargoParts.length > 0 && i < parts.length) {
                    const cargoLine = cargoParts.join(', ');
                    const remaining = parts.slice(i);
                    
                    if (remaining.length >= 2 && remaining[0] === 'Operations') {
                      return [
                        cargoLine,
                        remaining[0],
                        remaining.slice(1).join(' ')
                      ];
                    } else {
                      return [
                        cargoLine,
                        remaining.join(' ')
                      ];
                    }
                  }
                }
                return null;
              }
            ];
            
            // Try each strategy
            for (const strategy of strategies) {
              const lines = strategy();
              if (lines && !checkIntersection(lines)) {
                return lines;
              }
            }
            
            // If all strategies fail, force maximum breaking
            const words = text.split(/\s+/);
            if (words.length >= 3) {
              // Group words to create roughly equal lines
              const wordsPerLine = Math.ceil(words.length / 3);
              const lines = [];
              for (let i = 0; i < words.length; i += wordsPerLine) {
                lines.push(words.slice(i, i + wordsPerLine).join(' '));
              }
              return lines;
            }
          }
          
          // For non-operations text, use standard wrapping with intersection check
          let lines = wrapText(text, maxWidth, 3);
          
          // If intersection detected, try to break into more lines
          if (checkIntersection(lines) && lines.length < 3) {
            // Force more aggressive breaking
            const words = text.split(/\s+/);
            const wordsPerLine = Math.ceil(words.length / 3);
            lines = [];
            for (let i = 0; i < words.length; i += wordsPerLine) {
              lines.push(words.slice(i, i + wordsPerLine).join(' '));
            }
          }
          
          return lines;
        };

        // Wrap the event text if needed, but first replace SOF with cargo hold
        const eventTextWithCargoHold = event.cargo ? 
          replaceSOFWithCargoHold(event.event, event.cargo) : 
          event.event;
        
        const wrappedText = dynamicWrapText(eventTextWithCargoHold, event, textX, textAnchor, maxTextWidth);
        
        // Calculate vertical offset for multi-line text
        const lineHeight = 16; // Increased line height for better readability
        const textBlockHeight = wrappedText.length * lineHeight;
        
        // Position text to avoid overlapping with station circle
        // The text should start slightly above the station center
        const textStartY = event.y - (textBlockHeight / 2) + 2;
        
        // Create text element with proper positioning
        const labelElement = stationGroup.append('text')
          .attr('class', 'station-label')
          .attr('x', textX)
          .attr('y', textStartY)
          .style('font-weight', event.type === 'individual' ? '600' : '500')
          .style('text-anchor', textAnchor);
        
        // Add each line of wrapped text
        wrappedText.forEach((line, index) => {
          labelElement.append('tspan')
            .attr('x', textX)
            .attr('dy', index === 0 ? 0 : `${lineHeight}px`)
            .text(line);
        });

        // Timestamp with smart positioning
        if (showTimestamps) {
          stationGroup.append('text')
            .attr('class', 'station-time')
            .attr('x', textX)
            .attr('y', textStartY + textBlockHeight + 10)
            .style('text-anchor', textAnchor)
            .text(event.time);
        }

        // Duration indicator with smart positioning
        if (event.duration && event.duration !== '0m' && event.duration !== 'ongoing') {
          stationGroup.append('text')
            .attr('class', 'station-time')
            .attr('x', textX)
            .attr('y', textStartY + textBlockHeight + (showTimestamps ? 24 : 10))
            .style('font-weight', '600')
            .style('fill', '#3498db')
            .style('text-anchor', textAnchor)
            .text(`(${event.duration})`);
        }
      });
    });

    // Legend removed as requested

  }, [
    portOperations,
    cargoTypes,
    activePort, 
    activeCharterer, 
    showTimestamps, 
    focusTimeType,
    greyOutNonUnilever,
    containerWidth // Re-render when container width changes
  ]);

  return (
    <div className="tube-map-container">
      <svg 
        ref={svgRef} 
        className="tube-map-svg"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default TubeMapVisualization; 