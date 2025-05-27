import React, { useState, useEffect } from 'react';
import { vesselInfo, cargoTypes, tankData, portOperations, timeTracking, abbreviations } from './data/cargoData';
import TubeMapVisualization from './components/TubeMapVisualization';
import CollapsibleControlModal from './components/CollapsibleControlModal';
import TimeTrackingPanel from './components/TimeTrackingPanel';
import CargoStatusModal from './components/CargoStatusModal';
import FloatingPortModal from './components/FloatingPortModal';
import DemurrageSummary from './components/DemurrageSummary';
import './App.css';

function App() {
  const [activePort, setActivePort] = useState('all');
  const [activeCharterer, setActiveCharterer] = useState('all');
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [focusTimeType, setFocusTimeType] = useState('all');
  const [greyOutNonUnilever, setGreyOutNonUnilever] = useState(true);
  const [portInView, setPortInView] = useState(null); // Track which port is in view when scrolling
  
  // Track expanded states of sidebar panels for hyper-reactive sizing
  const [controlModalExpanded, setControlModalExpanded] = useState(false);
  const [timeTrackingExpanded, setTimeTrackingExpanded] = useState(false);
  const [demurrageSummaryExpanded, setDemurrageSummaryExpanded] = useState(true);

  const ports = Object.keys(portOperations);

  const handlePortFocus = (port) => {
    setActivePort(port);
    setPortInView(null); // Clear scroll-based selection when manually selecting
  };

  const handleChartererFilter = (charterer) => {
    setActiveCharterer(charterer);
  };

  const toggleTimestamps = () => {
    setShowTimestamps(!showTimestamps);
  };

  const toggleGreyOutNonUnilever = () => {
    setGreyOutNonUnilever(!greyOutNonUnilever);
  };

  const handleTimeTypeFocus = (timeType) => {
    setFocusTimeType(focusTimeType === timeType ? 'all' : timeType);
  };

  const handlePortInView = (port) => {
    setPortInView(port);
  };

  const resetView = () => {
    setActivePort('all');
    setActiveCharterer('all');
    setShowTimestamps(true);
    setFocusTimeType('all');
    setGreyOutNonUnilever(true);
    setPortInView(null);
  };

  // Scroll detection for port in view
  useEffect(() => {
    const handleScroll = () => {
      if (activePort !== 'all') return; // Only detect when viewing all ports
      
      const container = document.querySelector('.visualization-container');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const viewportCenter = containerRect.top + (containerRect.height / 2);
      
      // Find all port sections
      const portSections = container.querySelectorAll('g[data-port]');
      let closestPort = null;
      let closestDistance = Infinity;
      
      portSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + (rect.height / 2);
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPort = section.getAttribute('data-port');
        }
      });
      
      if (closestPort && closestPort !== portInView) {
        console.log('Port in view:', closestPort);
        setPortInView(closestPort);
      }
    };
    
    // Debounce scroll events
    let scrollTimeout;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };
    
    // Listen to both window and container scroll
    window.addEventListener('scroll', debouncedScroll);
    const container = document.querySelector('.visualization-container');
    if (container) {
      container.addEventListener('scroll', debouncedScroll);
    }
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      if (container) {
        container.removeEventListener('scroll', debouncedScroll);
      }
      clearTimeout(scrollTimeout);
    };
  }, [activePort, portInView]);

  return (
    <div className="app">
      {/* Combined Header and Cargo Status Modal - Fixed at top */}
      <CargoStatusModal 
        vesselInfo={vesselInfo}
        cargoTypes={tankData}
        portOperations={portOperations}
        ports={ports}
        abbreviations={abbreviations}
        greyOutNonUnilever={greyOutNonUnilever}
        activePort={activePort}
      />

      {/* Main Layout Container - Flexbox with visualization and sidebar */}
      <div className="main-layout">
        {/* Visualization Area - Takes up most of the space */}
        <div className="visualization-area">
          <TubeMapVisualization
            portOperations={portOperations}
            cargoTypes={cargoTypes}
            activePort={activePort}
            activeCharterer={activeCharterer}
            showTimestamps={showTimestamps}
            focusTimeType={focusTimeType}
            greyOutNonUnilever={greyOutNonUnilever}
            onPortInView={handlePortInView}
          />
        </div>

        {/* Right Sidebar Area - Contains sidebar only */}
        <div className="sidebar-area">
          {/* Right Sidebar - Hyper-reactive to panel expansion states */}
          <div 
            className={`right-sidebar ${controlModalExpanded || timeTrackingExpanded || demurrageSummaryExpanded ? 'has-expanded-content' : 'compact'}`}
          >
            {/* Demurrage Summary Panel */}
            <DemurrageSummary
              portOperations={portOperations}
              timeTracking={timeTracking}
            />

            {/* Collapsible Control Settings Panel */}
            <CollapsibleControlModal
              ports={ports}
              activePort={activePort}
              activeCharterer={activeCharterer}
              showTimestamps={showTimestamps}
              focusTimeType={focusTimeType}
              greyOutNonUnilever={greyOutNonUnilever}
              onPortFocus={handlePortFocus}
              onChartererFilter={handleChartererFilter}
              onToggleTimestamps={toggleTimestamps}
              onToggleGreyOutNonUnilever={toggleGreyOutNonUnilever}
              onTimeTypeFocus={handleTimeTypeFocus}
              onResetView={resetView}
              isExpanded={controlModalExpanded}
              onExpandedChange={setControlModalExpanded}
            />

            {/* Time Tracking Analysis Panel */}
            <TimeTrackingPanel
              timeTracking={timeTracking}
              activePort={activePort}
              cargoTypes={tankData}
              isExpanded={timeTrackingExpanded}
              onExpandedChange={setTimeTrackingExpanded}
            />
          </div>
        </div>

        {/* Individual Port Floating Modals - Positioned next to their port sections */}
        {Object.entries(portOperations).map(([port, data]) => {
          const isVisible = activePort === 'all' || activePort === port;
          
          return (
            <FloatingPortModal
              key={port}
              port={port}
              data={data}
              cargoTypes={cargoTypes}
              activePort={activePort}
              activeCharterer={activeCharterer}
              greyOutNonUnilever={greyOutNonUnilever}
              portInView={portInView}
              isVisible={isVisible}
              sidebarExpanded={controlModalExpanded || timeTrackingExpanded || demurrageSummaryExpanded}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App; 