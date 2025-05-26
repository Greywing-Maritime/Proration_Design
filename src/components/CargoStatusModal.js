// File: src/components/CargoStatusModal.js
// Purpose: Combined modal that displays vessel information, route, and cargo status - Single row with horizontal scrolling

import React, { useState, useEffect, useRef } from 'react';
import './CargoStatusModal.css';
import { colors } from '../styles/styleGuide'; // Import colors
import { useDispatch } from 'react-redux';

function CargoStatusModal({ 
  vesselInfo,
  cargoTypes, 
  portOperations, 
  ports,
  abbreviations,
  greyOutNonUnilever,
  activePort
}) {
  const [isSticky, setIsSticky] = useState(false);
  const [currentCargoes, setCurrentCargoes] = useState({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(0); // 0: full, 1: medium, 2: high, 3: maximum
  const [isVoyageSummaryExpanded, setIsVoyageSummaryExpanded] = useState(false); // State for voyage summary
  const [isCargoSectionExpanded, setIsCargoSectionExpanded] = useState(false); // Set initial state to false
  const modalRef = useRef(null);
  const cargoGridRef = useRef(null);
  const placeholderRef = useRef(null); // Reference to placeholder div
  const dispatch = useDispatch();

  // Calculate compression level based on screen width
  useEffect(() => {
    const updateCompressionLevel = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setCompressionLevel(0); // Full display
      } else if (width >= 1024) {
        setCompressionLevel(1); // Medium compression
      } else if (width >= 768) {
        setCompressionLevel(2); // High compression
      } else {
        setCompressionLevel(3); // Maximum compression
      }
    };

    updateCompressionLevel();
    window.addEventListener('resize', updateCompressionLevel);
    return () => window.removeEventListener('resize', updateCompressionLevel);
  }, []);

  // Calculate which cargoes are currently on board and sort by charterer priority
  useEffect(() => {
    const calculateCurrentCargoes = () => {
      const cargosOnBoard = {};
      
      // Use the actual cargo data from cargoTypes
      Object.keys(cargoTypes).forEach(cargoId => {
        const cargo = cargoTypes[cargoId];
        cargosOnBoard[cargoId] = {
          ...cargo,
          status: 'on-board' // For now, show all as on board
          // In a future enhancement, this will update based on scroll position
        };
      });

      setCurrentCargoes(cargosOnBoard);
    };

    calculateCurrentCargoes();
  }, [cargoTypes, portOperations]);

  // Sort cargoes by port priority (selected port first), charterer priority (Unilever first) and tank designation
  const getSortedCargoes = () => {
    return Object.entries(currentCargoes).sort(([aId, acargo], [bId, bcargo]) => {
      // If a specific port is selected, prioritize cargoes from that port
      if (activePort && activePort !== 'all') {
        const aHasActivePort = acargo.loadPort === activePort || acargo.dischargePort === activePort;
        const bHasActivePort = bcargo.loadPort === activePort || bcargo.dischargePort === activePort;
        
        // Prioritize cargoes that involve the selected port
        if (aHasActivePort && !bHasActivePort) return -1;
        if (!aHasActivePort && bHasActivePort) return 1;
      }
      
      // Second priority: Unilever cargoes come first (within port groups)
      if (acargo.charterer === 'UNILEVER' && bcargo.charterer !== 'UNILEVER') return -1;
      if (acargo.charterer !== 'UNILEVER' && bcargo.charterer === 'UNILEVER') return 1;
      
      // Third priority: Sort by tank designation (cargo hold) in ascending order
      const aTank = acargo.cargoHold || '';
      const bTank = bcargo.cargoHold || '';
      return aTank.localeCompare(bTank);
    });
  };

  // Count Unilever cargoes specifically
  const getUnileverCargoCount = () => {
    // Count all Unilever tanks
    const unileverTanks = Object.values(currentCargoes).filter(cargo => cargo.charterer === 'UNILEVER');
    return unileverTanks.length;
  };

  // Count total unique cargoes (not tanks)
  const getTotalTankCount = (filter) => {
    // For total count, we count all tanks
    return Object.keys(currentCargoes).length;
  };

  // Count OTHER charterer cargoes
  const getOtherCargoCount = () => {
    const otherTanks = Object.values(currentCargoes).filter(cargo => cargo.charterer !== 'UNILEVER');
    return otherTanks.length;
  };

  // New function to count distinct Unilever cargo names
  const getDistinctUnileverCargoNameCount = () => {
    const unileverTanks = Object.values(currentCargoes).filter(cargo => cargo.charterer === 'UNILEVER');
    if (unileverTanks.length === 0) return 0;
    const distinctNames = new Set(unileverTanks.map(tank => tank.name)); // Assuming 'name' defines a distinct cargo
    return distinctNames.size;
  };

  // Handle sticky behavior with a single, clean implementation
  useEffect(() => {
    let ticking = false;
    let visualizationArea = null;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!visualizationArea || !modalRef.current) {
              ticking = false;
              return;
            }
            
          const scrollTop = visualizationArea.scrollTop;
          
          // Simple check: if we've scrolled more than 100px, make it sticky
          // This accounts for the modal height and some buffer
          const shouldBeSticky = scrollTop > 100;
          
          if (shouldBeSticky !== isSticky) {
            console.log('Sticky state changing:', { 
              shouldBeSticky, 
              scrollTop
            });
            
            setIsSticky(shouldBeSticky);
            
            // Update placeholder height when becoming sticky
            if (modalRef.current) {
              const modalHeight = modalRef.current.offsetHeight;
              document.documentElement.style.setProperty('--modal-height', `${modalHeight}px`);
              console.log('Modal height set to:', modalHeight);
            }
            
            // Add/remove class from app element for additional styling if needed
                const appElement = document.querySelector('.app');
                if (appElement) {
                  if (shouldBeSticky) {
                    appElement.classList.add('modal-sticky');
                  } else {
                    appElement.classList.remove('modal-sticky');
                  }
                }
              }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Setup scroll listener
    const setupScrollListener = () => {
      visualizationArea = document.querySelector('.visualization-area');
      if (visualizationArea) {
        console.log('Visualization area found, adding scroll listener');
        visualizationArea.addEventListener('scroll', handleScroll, { passive: true });
        // Trigger initial check
        handleScroll();
      } else {
        console.log('Visualization area not found');
      }
    };

    // Try to set up the listener immediately and after a delay
    setupScrollListener();
    const timeoutId = setTimeout(setupScrollListener, 200);
    
    // Clean up
    return () => {
      clearTimeout(timeoutId);
      if (visualizationArea) {
        visualizationArea.removeEventListener('scroll', handleScroll);
      }
      // Reset sticky state
      setIsSticky(false);
      const appElement = document.querySelector('.app');
      if (appElement) {
        appElement.classList.remove('modal-sticky');
      }
    };
  }, [isSticky]); // Added isSticky to dependency array

  // Update scroll button states
  useEffect(() => {
    const updateScrollButtons = () => {
      if (cargoGridRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = cargoGridRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    updateScrollButtons();
    
    if (cargoGridRef.current) {
      cargoGridRef.current.addEventListener('scroll', updateScrollButtons);
      return () => {
        if (cargoGridRef.current) {
          cargoGridRef.current.removeEventListener('scroll', updateScrollButtons);
        }
      };
    }
  }, [currentCargoes]);

  // Scroll functions
  const scrollLeft = () => {
    if (cargoGridRef.current) {
      const scrollAmount = 280; // Scroll by approximately 2 items
      cargoGridRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (cargoGridRef.current) {
      const scrollAmount = 280; // Scroll by approximately 2 items
      cargoGridRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Helper function to get display text based on compression level
  const getDisplayText = (cargo) => {
    const { name, abbreviation, loadPortCode, dischargePortCode, loadPort, dischargePort, cargoHold } = cargo;
    
    switch (compressionLevel) {
      case 0: // Full display
        return {
          cargoName: name,
          loadPortDisplay: loadPort,
          dischargePortDisplay: dischargePort,
          cargoId: cargoHold // Use cargo hold instead of SOF
        };
      case 1: // Medium compression - abbreviate chemicals
        return {
          cargoName: abbreviation,
          loadPortDisplay: loadPort,
          dischargePortDisplay: dischargePort,
          cargoId: cargoHold
        };
      case 2: // High compression - abbreviate chemicals and ports
        return {
          cargoName: abbreviation,
          loadPortDisplay: loadPortCode,
          dischargePortDisplay: dischargePortCode,
          cargoId: cargoHold
        };
      case 3: // Maximum compression - minimal display
        return {
          cargoName: abbreviation,
          loadPortDisplay: loadPortCode.slice(-3), // Last 3 chars
          dischargePortDisplay: dischargePortCode === 'N/A' ? 'N/A' : dischargePortCode.slice(-3),
          cargoId: cargoHold
        };
      default:
        return {
          cargoName: name,
          loadPortDisplay: loadPort,
          dischargePortDisplay: dischargePort,
          cargoId: cargoHold
        };
    }
  };

  // Calculate voyage laytime totals
  const calculateVoyageLaytime = () => {
    // Actual allowed laytime from charter party
    const allowedHours = 106.73547; // From the charter party terms
    
    // Laytime rate: 150 MTPH for both load and discharge operations
    const laytimeRate = 150; // MTPH
    
    // Calculate actual used laytime from port operations
    let totalUsedHours = 0;
    let portBreakdown = [];
    
    // Parse laytime from each port
    if (portOperations['Kuala Tanjung']?.laytimeCalculation?.totalLaytime) {
      const ktHours = parseTimeToHours(portOperations['Kuala Tanjung'].laytimeCalculation.totalLaytime);
      totalUsedHours += ktHours;
      portBreakdown.push({ port: 'IDKTG', hours: ktHours });
    }
    
    if (portOperations['Kandla']?.laytimeCalculation?.netLaytime) {
      const kanHours = parseTimeToHours(portOperations['Kandla'].laytimeCalculation.netLaytime);
      totalUsedHours += kanHours;
      portBreakdown.push({ port: 'INKAN', hours: kanHours });
    }
    
    if (portOperations['Port Qasim']?.laytimeCalculation?.unileverLaytime) {
      const pqHours = parseTimeToHours(portOperations['Port Qasim'].laytimeCalculation.unileverLaytime);
      totalUsedHours += pqHours;
      portBreakdown.push({ port: 'PKQCT', hours: pqHours });
    }
    
    const demurrageHours = Math.max(0, totalUsedHours - allowedHours);
    const demurrageRate = 1000; // $1000 per hour (placeholder - would come from charter party)
    const demurrageAmount = demurrageHours * demurrageRate;
    
    // Calculate total cargo quantity for reference
    const unileverCargoes = Object.values(cargoTypes).filter(cargo => cargo.charterer === 'UNILEVER');
    const uniqueQuantities = new Map();
    
    // Group by splitGroup to avoid double-counting
    unileverCargoes.forEach(cargo => {
      const key = cargo.splitGroup || cargo.cargoHold;
      if (!uniqueQuantities.has(key)) {
        const quantity = parseInt(cargo.quantity.replace(/[^0-9]/g, ''));
        uniqueQuantities.set(key, quantity);
      }
    });
    
    const totalQuantity = Array.from(uniqueQuantities.values()).reduce((sum, qty) => sum + qty, 0);
    
    return {
      allowed: allowedHours,
      used: totalUsedHours,
      demurrage: demurrageHours,
      demurrageAmount: demurrageAmount,
      portBreakdown: portBreakdown,
      status: demurrageHours > 0 ? 'DEMURRAGE' : 'WITHIN LAYTIME',
      laytimeRate: laytimeRate,
      totalQuantity: totalQuantity
    };
  };
  
  // Helper function to parse time strings to hours
  const parseTimeToHours = (timeStr) => {
    let totalHours = 0;
    
    // Parse days
    const dayMatch = timeStr.match(/(\d+)d/);
    if (dayMatch) {
      totalHours += parseInt(dayMatch[1]) * 24;
    }
    
    // Parse hours
    const hourMatch = timeStr.match(/(\d+)h/);
    if (hourMatch) {
      totalHours += parseInt(hourMatch[1]);
    }
    
    // Parse minutes
    const minMatch = timeStr.match(/(\d+)m/);
    if (minMatch) {
      totalHours += parseInt(minMatch[1]) / 60;
    }
    
    return totalHours;
  };
  
  // Export voyage summary data
  const exportVoyageSummary = () => {
    const laytimeData = calculateVoyageLaytime();
    const exportData = {
      vessel: vesselInfo.vessel,
      voyage: vesselInfo.voyage,
      route: 'Kuala Tanjung → Kandla → Port Qasim',
      laytime: {
        allowed: `${laytimeData.allowed.toFixed(5)} hours`,
        used: `${laytimeData.used.toFixed(2)} hours`,
        demurrage: `${laytimeData.demurrage.toFixed(2)} hours`,
        demurrageAmount: `$${laytimeData.demurrageAmount.toLocaleString()}`,
        status: laytimeData.status,
        rate: `Load: ${laytimeData.laytimeRate} MTPH - Discharge: ${laytimeData.laytimeRate} MTPH`,
        totalCargo: `${laytimeData.totalQuantity.toLocaleString()} MT`
      },
      portBreakdown: laytimeData.portBreakdown.map(p => ({
        port: p.port,
        hours: `${p.hours.toFixed(2)}h`
      })),
      exportDate: new Date().toISOString()
    };
    
    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${vesselInfo.vessel}_Voyage${vesselInfo.voyage}_Laytime_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const sortedCargoes = getSortedCargoes();
  const cargoCount = sortedCargoes.length;
  const unileverTankCount = getUnileverCargoCount();
  const otherTankCount = getOtherCargoCount();
  const distinctUnileverCargoCount = getDistinctUnileverCargoNameCount();
  const needsScrolling = cargoCount > 12;
  const laytimeData = calculateVoyageLaytime();

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      // Logic to set initialTop for sticky header, if needed
    }
  }, []);

  useEffect(() => {
    const header = document.querySelector('.sticky-header-group');
    const cargoGrid = cargoGridRef.current; // scrollable container

    const handleScroll = () => {
      if (cargoGrid && header) {
        const headerOriginalTop = header.offsetTop; // Get original top position relative to offset parent
        if (cargoGrid.scrollTop > headerOriginalTop) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    if (cargoGrid) {
      cargoGrid.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (cargoGrid) {
        cargoGrid.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isSticky]); // Added isSticky

  // Effect to handle body scroll based on modal state
  useEffect(() => {
    const currentCargoGrid = cargoGridRef.current; // Capture ref value
    const handleResize = () => {
      if (currentCargoGrid) {
        // Your resize logic here, e.g., recalculate something based on new dimensions
        // console.log('Cargo grid resized');
      }
    };

    if (currentCargoGrid) {
      // Using ResizeObserver for better performance and reliability
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(currentCargoGrid);

      return () => {
        if (currentCargoGrid) { // Check if it's still valid before unobserving
          resizeObserver.unobserve(currentCargoGrid); // Use captured value in cleanup
        }
      };
    }
  }, []); // Empty dependency array if resize logic doesn't depend on other props/state

  return (
    <>
      {/* Placeholder div to prevent content jump when modal becomes fixed */}
      <div 
        ref={placeholderRef}
        className={`cargo-status-modal-placeholder ${isSticky ? 'active' : ''}`}
      />
      
    <div 
      ref={modalRef}
      className={`cargo-status-modal ${isSticky ? 'sticky' : ''} compression-${compressionLevel}`}
    >
      {/* Vessel Info Section - Updated for Unilever focus */}
      <div className="vessel-header-section">
        <div className="vessel-info-left">
          <h1 className="vessel-title">{vesselInfo.vessel}</h1>
          <div className="vessel-route">
            <span className="route-label">Route:</span>
            {compressionLevel >= 2 ? 
              ' IDKTG → INKDL → PKPQM' : 
              ' Kuala Tanjung 🇮🇩 → Kandla 🇮🇳 → Port Qasim 🇵🇰'
            }
          </div>
        </div>
        
        <div className="vessel-badges">
          <div className="info-badge voyage-badge">
            {compressionLevel >= 3 ? `V${vesselInfo.voyage}` : `Voyage ${vesselInfo.voyage}`}
          </div>
          <div className="info-badge charterer-badge">
            Unilever
          </div>
          <div className="info-badge duration-badge">
            {vesselInfo.totalVoyageDuration}
          </div>
          <div className="info-badge ports-badge">
            {ports.length} {compressionLevel >= 3 ? 'P' : 'Ports'}
          </div>
          <div className="info-badge cargo-count-badge" title={`${unileverTankCount} Unilever tanks, ${otherTankCount} Other tanks`}>
            {unileverTankCount + otherTankCount} {compressionLevel >= 3 ? 'T' : 'Tanks'}
          </div>
          <div className="info-badge unilever-cargoes-badge" style={{ background: colors.portThemes.kualaTanjung }} title={`${distinctUnileverCargoCount} distinct Unilever Cargoes`}>
            {distinctUnileverCargoCount} {compressionLevel >= 3 ? 'C' : 'Cargoes'}
          </div>
          {activePort && activePort !== 'all' && (
            <div className="info-badge port-focus-badge" style={{ background: '#3498db' }}>
              📍 {activePort}
            </div>
          )}
        </div>
      </div>

      {/* New Voyage Summary Bar */}
      <div className={`voyage-summary-bar ${isVoyageSummaryExpanded ? 'expanded' : 'collapsed'}`}>
        <div 
          className="voyage-summary-header"
          onClick={() => setIsVoyageSummaryExpanded(!isVoyageSummaryExpanded)}
        >
          <span className="voyage-summary-toggle">
            {isVoyageSummaryExpanded ? '▼' : '▶'}
          </span>
          <span className="voyage-summary-title">VOYAGE LAYTIME STATUS</span>
          {isVoyageSummaryExpanded ? (
            <span className={`voyage-summary-status ${laytimeData.status === 'DEMURRAGE' ? 'demurrage' : 'within-laytime'}`}>
              {laytimeData.status}
            </span>
          ) : (
            <div className="voyage-summary-collapsed-info">
              <span className="laytime-summary-item">
                <span className="laytime-label-inline">Used:</span>
                <span className="laytime-value-inline">{laytimeData.used.toFixed(2)}h</span>
              </span>
              <span className="laytime-summary-divider">/</span>
              <span className="laytime-summary-item">
                <span className="laytime-label-inline">Allowed:</span>
                <span className="laytime-value-inline">{laytimeData.allowed.toFixed(2)}h</span>
              </span>
              {laytimeData.demurrage > 0 && (
                <>
                  <span className="laytime-summary-divider">•</span>
                  <span className={`voyage-summary-status-inline demurrage`}>
                    DEMURRAGE ${laytimeData.demurrageAmount.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        
        {isVoyageSummaryExpanded && (
          <div className="voyage-summary-content">
            <div className="laytime-bars">
              <div className="laytime-bar-row">
                <span className="laytime-label">Allowed:</span>
                <span className="laytime-value">{laytimeData.allowed.toFixed(5)} hours</span>
                <div className="laytime-bar">
                  <div 
                    className="laytime-bar-fill allowed"
                      style={{ 
                        width: `${(laytimeData.allowed / Math.max(laytimeData.used, laytimeData.allowed)) * 100}%`,
                        backgroundColor: '#27ae60' // Green for allowed
                      }}
                  />
                </div>
              </div>
              
              <div className="laytime-bar-row">
                <span className="laytime-label">Used:</span>
                <span className="laytime-value">{laytimeData.used.toFixed(2)} hours</span>
                <div className="laytime-bar">
                  <div 
                    className="laytime-bar-fill used"
                    style={{ 
                      width: `${Math.min(100, (laytimeData.used / Math.max(laytimeData.used, laytimeData.allowed)) * 100)}%`,
                        backgroundColor: '#3498db' // Blue for used
                    }}
                  />
                </div>
              </div>
              
              {laytimeData.demurrage > 0 && (
                <div className="laytime-bar-row demurrage-row">
                  <span className="laytime-label">Demurrage:</span>
                  <span className="laytime-value">{laytimeData.demurrage.toFixed(2)} hours</span>
                  <div className="laytime-bar">
                    <div 
                      className="laytime-bar-fill demurrage"
                      style={{ 
                        width: `${(laytimeData.demurrage / Math.max(laytimeData.used, laytimeData.allowed)) * 100}%`,
                          backgroundColor: '#e74c3c' // Red for demurrage
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="voyage-summary-details">
              <div className="laytime-rate-info">
                <span className="rate-label">Laytime Rate:</span>
                  <span className="rate-value">Load: {laytimeData.laytimeRate} MTPH - Discharge: {laytimeData.laytimeRate} MTPH</span>
                <span className="cargo-total">• Total Cargo: {laytimeData.totalQuantity.toLocaleString()} MT</span>
              </div>
              
              <div className="port-breakdown">
                <span className="breakdown-label">Quick View:</span>
                  {laytimeData.portBreakdown.map((port, index) => {
                    // Map UNLOCODE to full port names
                    const portNameMap = {
                      'IDKTG': 'Kuala Tanjung',
                      'INKAN': 'Kandla',
                      'PKQCT': 'Port Qasim'
                    };
                    
                    // Calculate if we need to use UNLOCODE based on available space
                    const totalPortNamesLength = laytimeData.portBreakdown.reduce((sum, p) => {
                      const fullName = portNameMap[p.port] || p.port;
                      return sum + fullName.length + p.hours.toFixed(2).length + 10; // +10 for separators and hours
                    }, 0);
                    
                    // Use UNLOCODE if total length would exceed reasonable limit
                    const useUNLOCODE = totalPortNamesLength > 80 || compressionLevel >= 2;
                    const displayName = useUNLOCODE ? port.port : (portNameMap[port.port] || port.port);
                    
                    return (
                  <span key={port.port} className="port-hours">
                    {index > 0 && ' | '}
                        {displayName}: {port.hours.toFixed(2)}h
                  </span>
                    );
                  })}
                <span className="total-hours"> = {laytimeData.used.toFixed(2)}h</span>
              </div>
              
              <div className="voyage-summary-footer">
                <span className={`demurrage-amount ${laytimeData.demurrage > 0 ? 'has-demurrage' : ''}`}>
                  {laytimeData.demurrage > 0 
                    ? `DEMURRAGE $${laytimeData.demurrageAmount.toLocaleString()}`
                    : 'Within Allowed Laytime'
                  }
                </span>
                <button className="export-button" onClick={exportVoyageSummary}>
                  Export ↓
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cargo Pills - Single Row with Horizontal Scrolling */}
      <div className={`cargo-section ${isCargoSectionExpanded ? 'expanded' : 'collapsed'}`}>
        <div 
          className="cargo-section-header"
          onClick={() => setIsCargoSectionExpanded(!isCargoSectionExpanded)}
        >
          <span className="cargo-section-toggle">
            {isCargoSectionExpanded ? '▼' : '▶'}
          </span>
          <span className="cargo-section-title">CARGO TANKS</span>
          {isCargoSectionExpanded ? (
            <span className="cargo-section-count">
              {unileverTankCount} Unilever • {otherTankCount} Other
            </span>
          ) : (
            <div className="cargo-section-summary">
              <span className="cargo-summary-item unilever">
                <span className="cargo-count">{unileverTankCount}</span> Unilever
              </span>
              <span className="cargo-summary-divider">•</span>
              <span className="cargo-summary-item other">
                <span className="cargo-count">{otherTankCount}</span> Other
              </span>
              <span className="cargo-summary-divider">•</span>
              <span className="cargo-summary-item total">
                <span className="cargo-count">{laytimeData.totalQuantity.toLocaleString()}</span> MT Total
              </span>
            </div>
          )}
        </div>
        
        {isCargoSectionExpanded && (
          <div className="cargo-grid-container">
            {needsScrolling && (
              <button 
                className={`scroll-button left ${!canScrollLeft ? 'disabled' : ''}`}
                onClick={scrollLeft}
                disabled={!canScrollLeft}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
            )}
            
            <div 
              ref={cargoGridRef}
              className={`cargo-grid ${needsScrolling ? 'scrollable' : 'fit-to-width'} full-width`}
            >
              {sortedCargoes.map(([cargoId, cargo]) => {
                const displayText = getDisplayText(cargo);
                
                // Check if this cargo involves the selected port
                const isPortPrioritized = activePort && activePort !== 'all' && 
                  (cargo.loadPort === activePort || cargo.dischargePort === activePort);
                
                return (
                  <div 
                    key={cargoId}
                    className={`cargo-item ${cargo.status} ${cargo.charterer === 'UNILEVER' ? 'unilever-cargo' : 'other-cargo'} ${isPortPrioritized ? 'port-prioritized' : ''}`}
                    title={`${cargo.name} (${cargo.cargoHold}) - ${cargo.charterer} - ${cargo.loadPort} → ${cargo.dischargePort}`}
                  >
                    <div className="cargo-header">
                      <span 
                        className="cargo-indicator"
                        style={{ backgroundColor: greyOutNonUnilever && cargo.charterer !== 'UNILEVER' ? '#999' : cargo.color }}
                      />
                      <span className="cargo-id">{displayText.cargoId}</span>
                    </div>
                    
                    <div className="cargo-details">
                      <div className="cargo-charterer">
                        {compressionLevel >= 3 ? (cargo.charterer === 'UNILEVER' ? 'UNI' : 'OTH') : cargo.charterer}
                      </div>
                      <div className="cargo-name">{displayText.cargoName}</div>
                      {compressionLevel < 3 && (
                        <div className="cargo-ports">
                          <div className="port-info">
                            <span className="port-name">{displayText.loadPortDisplay}</span>
                          </div>
                          <div className="port-info">
                            <span className="port-name">{displayText.dischargePortDisplay}</span>
                          </div>
                        </div>
                      )}
                      <div className="cargo-quantity">
                        {compressionLevel >= 3 ? 
                          cargo.quantity.replace(' MT', 'T') : 
                          cargo.quantity
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {needsScrolling && (
              <button 
                className={`scroll-button right ${!canScrollRight ? 'disabled' : ''}`}
                onClick={scrollRight}
                disabled={!canScrollRight}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default CargoStatusModal; 