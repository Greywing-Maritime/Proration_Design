// File: src/components/CargoStatusModal.js
// Purpose: Combined modal that displays vessel information, route, and cargo status - Single row with horizontal scrolling

import React, { useState, useEffect, useRef } from 'react';
import './CargoStatusModal.css';

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
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(0); // 0: full, 1: medium, 2: high, 3: maximum
  const modalRef = useRef(null);
  const cargoGridRef = useRef(null);
  const initialTopRef = useRef(null); // Use ref instead of state to avoid re-renders

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
    return Object.values(currentCargoes).filter(cargo => cargo.charterer === 'UNILEVER').length;
  };

  // Handle sticky behavior with a single, clean implementation
  useEffect(() => {
    let ticking = false;
    let hasInitialized = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (modalRef.current) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Always reset to normal state when at the very top
            if (scrollTop < 5) {
              setIsSticky(false);
              const appElement = document.querySelector('.app');
              if (appElement) {
                appElement.classList.remove('modal-sticky');
              }
              hasInitialized = false; // Reset initialization flag
              initialTopRef.current = null; // Reset stored position
              ticking = false;
              return;
            }
            
            // Initialize position on first meaningful scroll
            if (!hasInitialized && scrollTop > 5) {
              const rect = modalRef.current.getBoundingClientRect();
              initialTopRef.current = rect.top + scrollTop;
              hasInitialized = true;
            }
            
            // Determine if modal should be sticky based on stored initial position
            if (initialTopRef.current) {
              const shouldBeSticky = scrollTop > initialTopRef.current - 20;
              
              if (shouldBeSticky !== isSticky) {
                setIsSticky(shouldBeSticky);
                
                const appElement = document.querySelector('.app');
                if (appElement) {
                  if (shouldBeSticky) {
                    appElement.classList.add('modal-sticky');
                  } else {
                    appElement.classList.remove('modal-sticky');
                  }
                }
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Ensure clean state on mount
    setIsSticky(false);
    const appElement = document.querySelector('.app');
    if (appElement) {
      appElement.classList.remove('modal-sticky');
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      const appElement = document.querySelector('.app');
      if (appElement) {
        appElement.classList.remove('modal-sticky');
      }
    };
  }, []); // No dependencies to avoid re-initialization

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

  const sortedCargoes = getSortedCargoes();
  const cargoCount = sortedCargoes.length;
  const unileverCargoCount = getUnileverCargoCount();
  const needsScrolling = cargoCount > 12;

  return (
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
          <div className="info-badge cargo-count-badge">
            {unileverCargoCount} {compressionLevel >= 3 ? 'C' : 'Cargoes'}
          </div>
          {activePort && activePort !== 'all' && (
            <div className="info-badge port-focus-badge" style={{ background: '#3498db' }}>
              📍 {activePort}
            </div>
          )}
        </div>
      </div>

      {/* Cargo Pills - Single Row with Horizontal Scrolling */}
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
    </div>
  );
}

export default CargoStatusModal; 