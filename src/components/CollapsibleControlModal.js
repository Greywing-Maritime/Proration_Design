import React from 'react';
import './CollapsibleControlModal.css';

const CollapsibleControlModal = ({
  ports,
  activePort,
  activeCharterer,
  showTimestamps,
  focusTimeType,
  greyOutNonUnilever,
  onPortFocus,
  onChartererFilter,
  onToggleTimestamps,
  onTimeTypeFocus,
  onToggleGreyOutNonUnilever,
  onResetView,
  isExpanded,
  onExpandedChange
}) => {
  
  const getPortButtonClass = (port) => {
    let baseClass = 'btn btn-port';
    if (port === 'Kuala Tanjung') baseClass += ' btn-kuala-tanjung';
    else if (port === 'Kandla') baseClass += ' btn-kandla';
    else if (port === 'Port Qasim') baseClass += ' btn-port-qasim';
    
    if (activePort === port) baseClass += ' active';
    return baseClass;
  };

  const handleToggle = () => {
    onExpandedChange(!isExpanded);
  };

  return (
    <div className="collapsible-control-modal">
      {/* Header with toggle button */}
      <div className="modal-header" onClick={handleToggle}>
        <h2 className="modal-title">Control Settings</h2>
        <div className="toggle-indicator">
          <span className={`arrow ${isExpanded ? 'expanded' : 'collapsed'}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Collapsible content */}
      <div className={`modal-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="controls-grid">
          {/* Port Focus Controls */}
          <div className="control-section">
            <h3>Port Focus</h3>
            <div className="btn-group">
              <button
                className={activePort === 'all' ? 'btn active' : 'btn'}
                onClick={() => onPortFocus('all')}
              >
                All Ports
              </button>
              {ports.map(port => (
                <button
                  key={port}
                  className={getPortButtonClass(port)}
                  onClick={() => onPortFocus(port)}
                >
                  {port}
                </button>
              ))}
            </div>
          </div>

          {/* Charterer Filter */}
          <div className="control-section">
            <h3>Charterer Filter</h3>
            <div className="btn-group">
              <button
                className={activeCharterer === 'all' ? 'btn active' : 'btn'}
                onClick={() => onChartererFilter('all')}
              >
                All Charterers
              </button>
              <button
                className={activeCharterer === 'UNILEVER' ? 'btn active' : 'btn'}
                style={{ background: activeCharterer === 'UNILEVER' ? '#1A73E8' : '#4285F4' }}
                onClick={() => onChartererFilter('UNILEVER')}
              >
                UNILEVER
              </button>
              <button
                className={activeCharterer === 'OTHER' ? 'btn active' : 'btn'}
                style={{ background: activeCharterer === 'OTHER' ? '#1A73E8' : '#34A853' }}
                onClick={() => onChartererFilter('OTHER')}
              >
                OTHER
              </button>
            </div>
          </div>

          {/* Display Options */}
          <div className="control-section">
            <h3>Display Options</h3>
            <div className="btn-group">
              <button
                className={showTimestamps ? 'btn active' : 'btn'}
                onClick={onToggleTimestamps}
              >
                {showTimestamps ? 'Hide' : 'Show'} Timestamps
              </button>
              <button
                className={greyOutNonUnilever ? 'btn active' : 'btn'}
                onClick={onToggleGreyOutNonUnilever}
                style={{ 
                  background: greyOutNonUnilever ? '#1A73E8' : '#4285F4',
                  color: 'white'
                }}
              >
                Focus Unilever
              </button>
            </div>
          </div>

          {/* Time Type Focus */}
          <div className="control-section">
            <h3>Time Type Focus</h3>
            <div className="btn-group">
              <button
                className={focusTimeType === 'all' ? 'btn active' : 'btn'}
                onClick={() => onTimeTypeFocus('all')}
              >
                All Time Types
              </button>
              <button
                className={focusTimeType === 'waiting' ? 'btn active' : 'btn'}
                style={{ 
                  background: focusTimeType === 'waiting' ? '#1A73E8' : '#F9AB00',
                  color: 'white'
                }}
                onClick={() => onTimeTypeFocus('waiting')}
              >
                Waiting Time
              </button>
              <button
                className={focusTimeType === 'laytime' ? 'btn active' : 'btn'}
                style={{ 
                  background: focusTimeType === 'laytime' ? '#1A73E8' : '#34A853',
                  color: 'white'
                }}
                onClick={() => onTimeTypeFocus('laytime')}
              >
                Laytime
              </button>
              <button
                className={focusTimeType === 'deduction' ? 'btn active' : 'btn'}
                style={{ 
                  background: focusTimeType === 'deduction' ? '#1A73E8' : '#EA4335',
                  color: 'white'
                }}
                onClick={() => onTimeTypeFocus('deduction')}
              >
                Deductions
              </button>
            </div>
          </div>

          {/* Reset Controls */}
          <div className="control-section">
            <button
              className="btn reset-btn"
              onClick={onResetView}
            >
              Reset View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleControlModal; 