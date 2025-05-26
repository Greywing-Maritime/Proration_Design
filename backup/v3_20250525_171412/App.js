import React, { useState } from 'react';
import { vesselInfo, cargoTypes, tankData, portOperations, timeTracking, abbreviations } from './data/cargoData';
import TubeMapVisualization from './components/TubeMapVisualization';
import ControlPanel from './components/ControlPanel';
import TimeTrackingPanel from './components/TimeTrackingPanel';
import CargoStatusModal from './components/CargoStatusModal';
import './App.css';

function App() {
  const [activePort, setActivePort] = useState('all');
  const [activeCharterer, setActiveCharterer] = useState('all');
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [focusTimeType, setFocusTimeType] = useState('all');
  const [greyOutNonUnilever, setGreyOutNonUnilever] = useState(true);

  const ports = Object.keys(portOperations);

  const handlePortFocus = (port) => {
    setActivePort(port);
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

  const resetView = () => {
    setActivePort('all');
    setActiveCharterer('all');
    setShowTimestamps(true);
    setFocusTimeType('all');
    setGreyOutNonUnilever(true);
  };

  return (
    <div className="app">
      {/* Combined Header and Cargo Status Modal */}
      <CargoStatusModal 
        vesselInfo={vesselInfo}
        cargoTypes={tankData}
        portOperations={portOperations}
        ports={ports}
        abbreviations={abbreviations}
        greyOutNonUnilever={greyOutNonUnilever}
        activePort={activePort}
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Tube Map Visualization */}
        <div className="visualization-container">
          <TubeMapVisualization
            portOperations={portOperations}
            cargoTypes={cargoTypes}
            activePort={activePort}
            activeCharterer={activeCharterer}
            showTimestamps={showTimestamps}
            focusTimeType={focusTimeType}
            greyOutNonUnilever={greyOutNonUnilever}
          />
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <ControlPanel
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
          />

          <TimeTrackingPanel
            timeTracking={timeTracking}
            activePort={activePort}
            cargoTypes={cargoTypes}
          />
        </div>
      </div>
    </div>
  );
}

export default App; 