import React from 'react';

const ControlPanel = ({
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
  onResetView
}) => {
  
  const getPortButtonClass = (port) => {
    let baseClass = 'btn btn-port';
    if (port === 'Kuala Tanjung') baseClass += ' btn-kuala-tanjung';
    else if (port === 'Kandla') baseClass += ' btn-kandla';
    else if (port === 'Port Qasim') baseClass += ' btn-port-qasim';
    
    if (activePort === port) baseClass += ' active';
    return baseClass;
  };

  return (
    <div>
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
            style={{ background: activeCharterer === 'UNILEVER' ? '#e32017' : '#0019a8' }}
            onClick={() => onChartererFilter('UNILEVER')}
          >
            UNILEVER
          </button>
          <button
            className={activeCharterer === 'OTHER' ? 'btn active' : 'btn'}
            style={{ background: activeCharterer === 'OTHER' ? '#e32017' : '#00782a' }}
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
              background: greyOutNonUnilever ? '#e32017' : '#0019a8',
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
              background: focusTimeType === 'waiting' ? '#e32017' : '#f39c12',
              color: 'white'
            }}
            onClick={() => onTimeTypeFocus('waiting')}
          >
            Waiting Time
          </button>
          <button
            className={focusTimeType === 'laytime' ? 'btn active' : 'btn'}
            style={{ 
              background: focusTimeType === 'laytime' ? '#e32017' : '#2ecc71',
              color: 'white'
            }}
            onClick={() => onTimeTypeFocus('laytime')}
          >
            Laytime
          </button>
          <button
            className={focusTimeType === 'deduction' ? 'btn active' : 'btn'}
            style={{ 
              background: focusTimeType === 'deduction' ? '#e32017' : '#e74c3c',
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
          className="btn"
          style={{ 
            background: '#95a5a6',
            width: '100%',
            padding: '12px'
          }}
          onClick={onResetView}
        >
          Reset View
        </button>
      </div>
    </div>
  );
};

export default ControlPanel; 