// File: src/components/FloatingPortModal.js
// Purpose: Individual floating modal for each port that aligns with its port section in the tube map

import React, { useState, useEffect, useRef } from 'react';
import FloatingSituationalAwarenessPanel from './FloatingSituationalAwarenessPanel';
import './FloatingPortModal.css';

const FloatingPortModal = ({ 
  port, 
  data, 
  cargoTypes,
  activePort,
  activeCharterer,
  greyOutNonUnilever,
  portInView,
  isVisible,
  sidebarExpanded
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [positionMode, setPositionMode] = useState('absolute'); // 'fixed' or 'absolute'
  const modalRef = useRef(null);

  // Function to ensure page can scroll past floating modals
  const ensureScrollableHeight = () => {
    const allFloatingModals = document.querySelectorAll('.floating-port-modal');
    let maxBottomPosition = 0;
    
    allFloatingModals.forEach(modal => {
      const rect = modal.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      const modalBottom = rect.top + scrollTop + rect.height;
      maxBottomPosition = Math.max(maxBottomPosition, modalBottom);
    });
    
    // Add extra padding to ensure comfortable scrolling past the modals
    const extraPadding = 200;
    const requiredHeight = maxBottomPosition + extraPadding;
    
    // Get the current document height
    const currentDocHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    // Only update if we need more height
    if (requiredHeight > currentDocHeight) {
      document.body.style.minHeight = `${requiredHeight}px`;
    }
  };

  // Position modal to align with its port section
  useEffect(() => {
    const updatePosition = () => {
      const portGroup = document.querySelector(`g[data-port="${port}"]`);
      const visualizationArea = document.querySelector('.visualization-area');
      const mainLayout = document.querySelector('.main-layout');
      const cargoStatusModal = document.querySelector('.cargo-status-modal');
      
      if (!portGroup || !visualizationArea || !mainLayout) {
        const portIndex = ['Kuala Tanjung', 'Kandla', 'Port Qasim'].indexOf(port);
        setPosition({
          top: 200 + (portIndex * 300),
          left: visualizationArea ? visualizationArea.offsetWidth + 16 : window.innerWidth - 400
        });
        setPositionMode('absolute');
        // Ensure scrollable height after positioning
        setTimeout(ensureScrollableHeight, 100);
        return;
      }
      
      const vizRect = visualizationArea.getBoundingClientRect();
      const mainLayoutRect = mainLayout.getBoundingClientRect();
      const modalHeight = modalRef.current ? modalRef.current.offsetHeight : 400;
      
      // USE WINDOW SCROLL TOP
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      
      const leftPosition = vizRect.right - mainLayoutRect.left + 16;

      const portGroupBBox = portGroup.getBBox();
      const portSectionTopInSVG = portGroupBBox.y;
      const portSectionHeightInSVG = portGroupBBox.height;
      
      const portTitle = portGroup.querySelector('.port-title');
      const portTitleY_SVG = portTitle ? portTitle.getBBox().y : portSectionTopInSVG;
      
      // Calculate sticky threshold - this should be below the cargo status modal when it's sticky
      let stickyViewportThreshold = 10; // Default: 10px from viewport top
      
      // Check if cargo status modal is sticky and get its bottom position
      if (cargoStatusModal && cargoStatusModal.classList.contains('sticky')) {
        const cargoModalRect = cargoStatusModal.getBoundingClientRect();
        stickyViewportThreshold = cargoModalRect.bottom + 16; // 16px gap below cargo modal
      }
      
      // For Kuala Tanjung, also consider the right sidebar
      if (port === 'Kuala Tanjung') {
        const rightSidebar = document.querySelector('.right-sidebar');
        if (rightSidebar) {
          const sidebarRect = rightSidebar.getBoundingClientRect();
          // Use whichever is lower - cargo modal or sidebar
          stickyViewportThreshold = Math.max(stickyViewportThreshold, sidebarRect.bottom + 16);
        }
      }
      
      // Calculate the port section's position in viewport
      const portSectionTopInViewport = vizRect.top + portSectionTopInSVG; 
      const portSectionBottomInViewport = vizRect.top + portSectionTopInSVG + portSectionHeightInSVG;

      // Is the port section visible in the viewport?
      const isPortVisibleInViewport = portSectionBottomInViewport > 0 && portSectionTopInViewport < window.innerHeight;
      
      if (!isPortVisibleInViewport) {
        // Port section is off-screen (due to window scroll)
        // Position it absolutely, aligned with its natural (scrolled) position
        setPositionMode('absolute');
        let topValue;
        if (portSectionTopInViewport > window.innerHeight) { // Below viewport
            topValue = portTitleY_SVG + vizRect.top - mainLayoutRect.top; 
        } else { // Above viewport
            topValue = (portSectionTopInSVG + portSectionHeightInSVG - modalHeight) + vizRect.top - mainLayoutRect.top;
        }
        setPosition({ top: topValue, left: leftPosition });

      } else {
        // Port section is visible in the viewport.
        if (portSectionTopInViewport <= stickyViewportThreshold) {
          // The top of the port section has reached or passed the sticky threshold.
          setPositionMode('fixed');
          let fixedTopPosition = stickyViewportThreshold;

          // Check if other floating port modals are already occupying space
          const allPortModals = Array.from(document.querySelectorAll('.floating-port-modal.is-sticky'));
          const portOrder = ['Kuala Tanjung', 'Kandla', 'Port Qasim'];
          const currentPortIndex = portOrder.indexOf(port);
          
          // Calculate position based on other sticky modals above this one
          allPortModals.forEach(modal => {
            const modalPort = modal.getAttribute('data-port');
            const modalIndex = portOrder.indexOf(modalPort);
            
            if (modalIndex < currentPortIndex && modal !== modalRef.current) {
              const modalRect = modal.getBoundingClientRect();
              fixedTopPosition = Math.max(fixedTopPosition, modalRect.bottom + 16);
            }
          });

          // If port section is scrolling off top and modal would be cut, move modal up.
          const spaceAtBottomOfPort = portSectionBottomInViewport - fixedTopPosition;
          if (spaceAtBottomOfPort < modalHeight) {
            fixedTopPosition = portSectionBottomInViewport - modalHeight;
            // Ensure it doesn't go above the stickyViewportThreshold
            fixedTopPosition = Math.max(fixedTopPosition, stickyViewportThreshold);
          }
          
          setPosition({ top: fixedTopPosition, left: leftPosition + mainLayoutRect.left });

        } else {
          // Port section is visible but its top hasn't reached the sticky threshold yet.
          // Position it absolutely, aligned with its title.
          setPositionMode('absolute');
          let alignmentTop = portTitleY_SVG + vizRect.top - mainLayoutRect.top;
          
          // Ensure it doesn't overlap with sticky cargo modal
          if (cargoStatusModal && cargoStatusModal.classList.contains('sticky')) {
            const cargoModalRect = cargoStatusModal.getBoundingClientRect();
            const minTop = cargoModalRect.bottom - mainLayoutRect.top + 16;
            alignmentTop = Math.max(alignmentTop, minTop);
          }
          
          setPosition({ top: alignmentTop, left: leftPosition });
        }
      }
      
      // Ensure scrollable height after positioning
      setTimeout(ensureScrollableHeight, 100);
    };

    setTimeout(updatePosition, 100);
    const handleUpdate = () => requestAnimationFrame(updatePosition);
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate); // LISTEN TO WINDOW SCROLL
    
    const intervalId = setInterval(updatePosition, 100);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate); // CLEANUP WINDOW SCROLL
      clearInterval(intervalId);
    };
  }, [port, isVisible]);

  // Cleanup minimum height when component unmounts
  useEffect(() => {
    return () => {
      // Reset body min-height when all modals are unmounted
      const remainingModals = document.querySelectorAll('.floating-port-modal');
      if (remainingModals.length === 0) {
        document.body.style.minHeight = '';
      }
    };
  }, []);

  if (!isVisible) return null;

  const isHighlighted = portInView === port && activePort === 'all';
  
  return (
    <div 
      ref={modalRef}
      className={`floating-port-modal ${positionMode === 'fixed' ? 'is-sticky' : ''}`}
      data-port={port}
      style={{
        position: positionMode,
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <FloatingSituationalAwarenessPanel
        port={port}
        data={data}
        cargoTypes={cargoTypes}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        activeCharterer={activeCharterer}
        greyOutNonUnilever={greyOutNonUnilever}
        isHighlighted={isHighlighted}
      />
    </div>
  );
};

export default FloatingPortModal; 