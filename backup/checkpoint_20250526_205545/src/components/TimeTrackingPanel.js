import React, { useState } from 'react';

const TimeTrackingPanel = ({ timeTracking, activePort, cargoTypes, isExpanded, onExpandedChange }) => {
  const [activeTab, setActiveTab] = useState('All Ports');

  const handleToggle = () => {
    onExpandedChange(!isExpanded);
  };

  const getPortData = (portName) => {
    return timeTracking[portName] || {};
  };

  // Calculate aggregate data across all ports
  const getAllPortsData = () => {
    const ports = Object.keys(timeTracking);
    let totalVoyageTime = 0;
    let totalUnileverTime = 0;
    let totalOtherTime = 0;
    const cargoAggregates = {};
    
    // Parse time string to minutes for calculations
    const parseTime = (timeStr) => {
      if (!timeStr) return 0;
      const parts = timeStr.match(/(\d+)h\s*(\d+)m/) || timeStr.match(/(\d+)h/) || timeStr.match(/(\d+)m/);
      if (!parts) return 0;
      
      if (timeStr.includes('h') && timeStr.includes('m')) {
        return parseInt(parts[1]) * 60 + parseInt(parts[2]);
      } else if (timeStr.includes('h')) {
        return parseInt(parts[1]) * 60;
      } else if (timeStr.includes('m')) {
        return parseInt(parts[1]);
      }
      return 0;
    };

    // Format minutes back to time string
    const formatMinutes = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0 && mins > 0) {
        return `${hours}h ${mins}m`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else {
        return `${mins}m`;
      }
    };

    ports.forEach(portName => {
      const portData = timeTracking[portName];
      if (!portData) return;

      // Add to total voyage time
      totalVoyageTime += parseTime(portData.totalTime);

      // Process cargo breakdowns
      if (portData.breakdown) {
        Object.entries(portData.breakdown).forEach(([cargoId, cargoData]) => {
          if (!cargoAggregates[cargoId]) {
            cargoAggregates[cargoId] = {
              laytime: 0,
              waiting: 0,
              deductions: 0,
              ports: []
            };
          }
          
          cargoAggregates[cargoId].laytime += parseTime(cargoData.laytime);
          cargoAggregates[cargoId].waiting += parseTime(cargoData.waiting);
          cargoAggregates[cargoId].deductions += parseTime(cargoData.deductions);
          cargoAggregates[cargoId].ports.push(portName);
        });
      }

      // Add to charterer totals
      if (portData.chartererSplit) {
        const portTimeMinutes = parseTime(portData.totalTime);
        totalUnileverTime += (portTimeMinutes * portData.chartererSplit.unilever / 100);
        totalOtherTime += (portTimeMinutes * portData.chartererSplit.other / 100);
      }
    });

    // Calculate percentages and format final data
    const formattedCargoBreakdown = {};
    Object.entries(cargoAggregates).forEach(([cargoId, data]) => {
      const totalCargoTime = data.laytime + data.waiting + data.deductions;
      formattedCargoBreakdown[cargoId] = {
        laytime: formatMinutes(data.laytime),
        waiting: formatMinutes(data.waiting),
        deductions: formatMinutes(data.deductions),
        percentage: totalVoyageTime > 0 ? (totalCargoTime / totalVoyageTime) * 100 : 0,
        ports: data.ports
      };
    });

    return {
      totalTime: formatMinutes(totalVoyageTime),
      breakdown: formattedCargoBreakdown,
      chartererSplit: {
        unilever: totalVoyageTime > 0 ? (totalUnileverTime / totalVoyageTime) * 100 : 0,
        other: totalVoyageTime > 0 ? (totalOtherTime / totalVoyageTime) * 100 : 0
      }
    };
  };

  const formatTime = (timeString) => {
    if (!timeString) return '0h 0m';
    return timeString;
  };

  const renderCargoBreakdown = (portName, portData) => {
    if (!portData.breakdown) return null;
    
    const isAllPorts = portName === 'All Ports';

    return (
      <div className="cargo-breakdown">
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#2c3e50',
          marginBottom: '12px',
          borderBottom: '1px solid #e1e8ed',
          paddingBottom: '6px'
        }}>
          {isAllPorts ? 'Voyage-Wide Cargo Time Allocation' : 'Cargo Time Allocation'}
        </h4>
        
        {Object.entries(portData.breakdown).map(([cargoId, data]) => {
          const cargoInfo = cargoTypes[cargoId];
          if (!cargoInfo) return null;

          return (
            <div key={cargoId} style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '8px',
                flexWrap: 'wrap'
              }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: cargoInfo.color,
                  borderRadius: '2px',
                  marginRight: '8px'
                }} />
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  {cargoId}: {cargoInfo.name}
                </span>
                <span style={{ 
                  fontSize: '11px', 
                  color: '#7f8c8d',
                  marginLeft: '8px',
                  padding: '2px 6px',
                  background: cargoInfo.charterer === 'UNILEVER' ? '#e8f5e8' : '#f0f8ff',
                  borderRadius: '10px'
                }}>
                  {cargoInfo.charterer}
                </span>
                
                {/* Show ports for All Ports view */}
                {isAllPorts && data.ports && (
                  <span style={{ 
                    fontSize: '10px', 
                    color: '#95a5a6',
                    marginLeft: '8px',
                    fontStyle: 'italic'
                  }}>
                    ({data.ports.join(', ')})
                  </span>
                )}
              </div>

              <div className="time-stats">
                <div className="stat-row">
                  <span className="stat-label">Laytime:</span>
                  <span className="stat-value" style={{ color: '#2ecc71' }}>
                    {formatTime(data.laytime)}
                  </span>
                  <span className="stat-percentage">
                    ({data.percentage.toFixed(1)}%)
                  </span>
                </div>
                
                <div className="stat-row">
                  <span className="stat-label">Waiting:</span>
                  <span className="stat-value" style={{ color: '#f39c12' }}>
                    {formatTime(data.waiting)}
                  </span>
                </div>
                
                <div className="stat-row">
                  <span className="stat-label">Deductions:</span>
                  <span className="stat-value" style={{ color: '#e74c3c' }}>
                    {formatTime(data.deductions)}
                  </span>
                </div>

                {/* Progress bar showing relative contribution */}
                <div className="progress-bar" style={{ marginTop: '6px' }}>
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${data.percentage}%`,
                      backgroundColor: cargoInfo.color
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderChartererSplit = (portData) => {
    if (!portData.chartererSplit) return null;

    const unileverPercent = portData.chartererSplit.unilever;
    const otherPercent = portData.chartererSplit.other;

    return (
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#2c3e50',
          marginBottom: '12px',
          borderBottom: '1px solid #e1e8ed',
          paddingBottom: '6px'
        }}>
          Charterer Distribution
        </h4>
        
        <div className="charterer-split">
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '500' }}>UNILEVER</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#e32017' }}>
                {unileverPercent.toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar" style={{ marginTop: '4px' }}>
              <div 
                className="progress-fill"
                style={{ 
                  width: `${unileverPercent}%`,
                  backgroundColor: '#e32017'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '500' }}>OTHER</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#00782a' }}>
                {otherPercent.toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar" style={{ marginTop: '4px' }}>
              <div 
                className="progress-fill"
                style={{ 
                  width: `${otherPercent}%`,
                  backgroundColor: '#00782a'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPortSummary = (portName, portData) => {
    if (!portData.totalTime) return null;
    
    const isAllPorts = portName === 'All Ports';

    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          background: isAllPorts ? '#f0f8ff' : '#f8f9fa',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: isAllPorts ? '2px solid #2196f3' : 'none'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#2c3e50' }}>
              {isAllPorts ? 'Total Voyage Time:' : 'Total Port Time:'}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0019a8' }}>
              {portData.totalTime}
            </span>
          </div>
          {isAllPorts && (
            <div style={{ 
              marginTop: '8px',
              fontSize: '11px',
              color: '#7f8c8d',
              fontStyle: 'italic'
            }}>
              Aggregated across all ports: Kuala Tanjung, Kandla, Port Qasim
            </div>
          )}
        </div>
      </div>
    );
  };

  const ports = Object.keys(timeTracking);
  const allTabs = ['All Ports', ...ports];

  return (
    <div 
      className="time-tracking time-tracking-panel"
      style={{
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {/* Collapsible Header */}
      <div 
        className="time-tracking-header"
        onClick={handleToggle}
        style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #4A90E2 0%, #2C5282 100%)',
          borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <h3 style={{ 
          fontSize: '1.2rem',
          fontWeight: '600', 
          color: 'white',
          margin: 0,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Time Tracking Analysis
        </h3>
        <span style={{
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'transform 0.3s ease',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </span>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="time-tracking-content" style={{
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '0 0 12px 12px',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          {/* Port Tabs */}
          <div className="port-tabs" style={{ marginBottom: '20px' }}>
            {allTabs.map(tabName => {
              const isActive = activeTab === tabName;
              const isAllPorts = tabName === 'All Ports';
              
              let tabColor;
              if (isAllPorts) {
                tabColor = '#34495e';
              } else {
                tabColor = tabName === 'Kuala Tanjung' ? '#e91e63' : 
                          tabName === 'Kandla' ? '#9c27b0' : '#2196f3';
              }
              
              return (
                <button
                  key={tabName}
                  className={isActive ? 'btn active' : 'btn'}
                  style={{ 
                    fontSize: '11px',
                    padding: '6px 12px',
                    margin: '2px',
                    background: isActive ? tabColor : '#f8f9fa',
                    color: isActive ? 'white' : '#2c3e50',
                    border: `1px solid ${tabColor}`,
                    borderRadius: '6px',
                    fontWeight: isAllPorts ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setActiveTab(tabName)}
                >
                  {tabName}
                </button>
              );
            })}
          </div>

          {/* Active Port Data */}
          {activeTab && (
            <div className="port-analysis">
              {(() => {
                const portData = activeTab === 'All Ports' ? getAllPortsData() : getPortData(activeTab);
                return (
                  <>
                    {renderPortSummary(activeTab, portData)}
                    {renderCargoBreakdown(activeTab, portData)}
                    {renderChartererSplit(portData)}
                  </>
                );
              })()}
            </div>
          )}

          {/* Legend */}
          <div style={{ 
            marginTop: '24px',
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e1e8ed'
          }}>
            <h4 style={{ 
              fontSize: '13px', 
              fontWeight: '600', 
              color: '#2c3e50',
              marginBottom: '8px'
            }}>
              Legend
            </h4>
            <div style={{ fontSize: '11px', color: '#7f8c8d', lineHeight: '1.5' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Line Behavior:</strong>
              </div>
              <div style={{ marginBottom: '4px' }}>
                • Lines bundle together during shared operations
              </div>
              <div style={{ marginBottom: '4px' }}>
                • Individual operations branch out from bundle
              </div>
              <div style={{ marginBottom: '4px' }}>
                • Bundle width adjusts dynamically
              </div>
              <div style={{ marginBottom: '12px' }}>
                • Lines return to original positions
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>Station Types:</strong>
              </div>
              <div style={{ marginBottom: '4px' }}>
                🔘 Gray: Shared operations
              </div>
              <div style={{ marginBottom: '4px' }}>
                🔴 Colored: Individual cargo operations
              </div>
              
              <div style={{ marginTop: '12px', marginBottom: '8px' }}>
                <strong>Time Types:</strong>
              </div>
              <div style={{ marginBottom: '4px' }}>
                🟢 Green: Active laytime
              </div>
              <div style={{ marginBottom: '4px' }}>
                🟡 Striped: Waiting time
              </div>
              <div style={{ marginBottom: '4px' }}>
                🔴 Striped: Deduction periods
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for styling */}
      <style>{`
        .time-stats {
          padding-left: 20px;
        }
        
        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          font-size: 11px;
        }
        
        .stat-label {
          color: #7f8c8d;
          font-weight: 500;
        }
        
        .stat-value {
          font-weight: 600;
        }
        
        .stat-percentage {
          color: #95a5a6;
          font-size: 10px;
        }
        
        .progress-bar {
          width: 100%;
          height: 4px;
          background-color: #f1f2f6;
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        
        .charterer-split .progress-bar {
          height: 6px;
        }
        
        .cargo-breakdown {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .time-tracking-header:hover {
          background: linear-gradient(135deg, #2C5282 0%, #1A3A5E 100%); /* Darker blue gradient for hover */
        }

        /* Responsive styles for floating panel */
        @media (max-width: 1400px) {
          .time-tracking-panel {
            width: 320px !important;
            right: 15px !important;
          }
        }

        @media (max-width: 1200px) {
          .time-tracking-panel {
            width: 300px !important;
            right: 10px !important;
          }
        }

        @media (max-width: 768px) {
          .time-tracking-panel {
            position: fixed !important;
            top: 300px !important;
            right: 10px !important;
            left: 10px !important;
            width: auto !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TimeTrackingPanel; 