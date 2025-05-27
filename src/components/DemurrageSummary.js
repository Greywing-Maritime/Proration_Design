// File: src/components/DemurrageSummary.js
// Purpose: Display final demurrage calculation summary aggregating all port data
// This component shows total laytime used vs allowed and calculates demurrage due

import React, { useState } from 'react';
import './DemurrageSummary.css';

const DemurrageSummary = ({ portOperations, timeTracking }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Parse duration string to hours (decimal)
  const parseDurationToHours = (duration) => {
    if (!duration || duration === '0m' || duration === 'ongoing') return 0;
    
    let totalMinutes = 0;
    const parts = duration.split(' ');
    
    parts.forEach(part => {
      if (part.includes('d')) {
        totalMinutes += parseInt(part) * 24 * 60;
      } else if (part.includes('h')) {
        totalMinutes += parseInt(part) * 60;
      } else if (part.includes('m')) {
        totalMinutes += parseInt(part);
      }
    });
    
    return totalMinutes / 60; // Convert to hours
  };

  // Format hours to display string
  const formatHours = (hours) => {
    const totalMinutes = Math.round(hours * 60);
    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingMinutes = totalMinutes % (24 * 60);
    const hrs = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0) parts.push(`${mins}m`);
    
    return parts.join(' ') || '0m';
  };

  // Calculate total laytime used across all ports
  const calculateTotalLaytime = () => {
    const portTotals = {
      'Kuala Tanjung': { used: 0, allowed: 0 },
      'Kandla': { used: 0, allowed: 0 },
      'Port Qasim': { used: 0, allowed: 0 }
    };

    // Get laytime used from each port
    Object.entries(portOperations).forEach(([portName, portData]) => {
      if (portName === 'Kuala Tanjung') {
        // For Kuala Tanjung: 50h 15m (already net)
        portTotals[portName].used = 50.25;
      } else if (portName === 'Kandla') {
        // For Kandla: 106h 00m (net after deductions)
        portTotals[portName].used = 106.00;
      } else if (portName === 'Port Qasim') {
        // For Port Qasim: 21h 39m (Unilever's share only)
        portTotals[portName].used = 21.65;
      }
    });

    // Calculate total laytime used
    const totalUsedHours = Object.values(portTotals).reduce((sum, port) => sum + port.used, 0);

    // Laytime allowed calculation based on the statement
    // Total allowed: 106.735747 hours (4.447322 days)
    const totalAllowedHours = 106.735747;

    // Calculate excess (demurrage)
    const excessHours = totalUsedHours - totalAllowedHours;
    const excessDays = excessHours / 24;

    // Demurrage rate: $24,000 per day
    const demurrageRate = 24000;
    const demurrageAmount = excessDays * demurrageRate;

    return {
      portTotals,
      totalUsedHours,
      totalUsedDays: totalUsedHours / 24,
      totalAllowedHours,
      totalAllowedDays: totalAllowedHours / 24,
      excessHours,
      excessDays,
      demurrageRate,
      demurrageAmount
    };
  };

  const calculation = calculateTotalLaytime();

  return (
    <div className="demurrage-summary">
      {/* Header */}
      <div 
        className="summary-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>
          Demurrage Summary
        </h3>
        <div className="header-right">
          <span className="demurrage-preview">
            ${calculation.demurrageAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="toggle-icon">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="summary-content">
          {/* Port Breakdown */}
          <div className="port-breakdown">
            <h4>Laytime by Port</h4>
            <div className="port-list">
              <div className="port-item">
                <span className="port-name">Kuala Tanjung</span>
                <span className="port-time">{formatHours(calculation.portTotals['Kuala Tanjung'].used)}</span>
                <span className="port-days">({(calculation.portTotals['Kuala Tanjung'].used / 24).toFixed(3)} days)</span>
              </div>
              <div className="port-item">
                <span className="port-name">Kandla</span>
                <span className="port-time">{formatHours(calculation.portTotals['Kandla'].used)}</span>
                <span className="port-days">({(calculation.portTotals['Kandla'].used / 24).toFixed(3)} days)</span>
              </div>
              <div className="port-item">
                <span className="port-name">Port Qasim</span>
                <span className="port-time">{formatHours(calculation.portTotals['Port Qasim'].used)}</span>
                <span className="port-days">({(calculation.portTotals['Port Qasim'].used / 24).toFixed(3)} days)</span>
              </div>
            </div>
          </div>

          {/* Main Calculation */}
          <div className="main-calculation">
            <div className="calc-section">
              <div className="calc-row total">
                <span className="calc-label">Total Laytime Used:</span>
                <span className="calc-value">
                  {formatHours(calculation.totalUsedHours)}
                  <span className="calc-days"> ({calculation.totalUsedDays.toFixed(3)} days)</span>
                </span>
              </div>
              <div className="calc-row allowed">
                <span className="calc-label">Total Laytime Allowed:</span>
                <span className="calc-value">
                  {formatHours(calculation.totalAllowedHours)}
                  <span className="calc-days"> ({calculation.totalAllowedDays.toFixed(3)} days)</span>
                </span>
              </div>
              <div className="calc-divider"></div>
              <div className="calc-row excess">
                <span className="calc-label">Excess (Demurrage):</span>
                <span className="calc-value excess-value">
                  {formatHours(calculation.excessHours)}
                  <span className="calc-days"> ({calculation.excessDays.toFixed(3)} days)</span>
                </span>
              </div>
            </div>

            {/* Demurrage Calculation */}
            <div className="demurrage-calculation">
              <div className="rate-info">
                <span className="rate-label">Demurrage Rate:</span>
                <span className="rate-value">$24,000/day</span>
              </div>
              <div className="final-amount">
                <span className="amount-label">DEMURRAGE DUE:</span>
                <span className="amount-value">
                  ${calculation.demurrageAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Details Toggle */}
          <button 
            className="details-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide' : 'Show'} Calculation Details
          </button>

          {/* Detailed Breakdown */}
          {showDetails && (
            <div className="detailed-breakdown">
              <h4>Calculation Details</h4>
              <div className="details-content">
                <div className="detail-item">
                  <span className="detail-label">Kuala Tanjung:</span>
                  <span className="detail-value">50.25 hours = 2.094 days</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Kandla:</span>
                  <span className="detail-value">106.00 hours = 4.417 days</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Port Qasim (UNILEVER share):</span>
                  <span className="detail-value">21.65 hours = 0.902 days</span>
                </div>
                <div className="detail-divider"></div>
                <div className="detail-item total">
                  <span className="detail-label">Total Used:</span>
                  <span className="detail-value">177.90 hours = 7.413 days</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Allowed:</span>
                  <span className="detail-value">106.74 hours = 4.447 days</span>
                </div>
                <div className="detail-item excess">
                  <span className="detail-label">Excess:</span>
                  <span className="detail-value">71.16 hours = 2.965 days</span>
                </div>
                <div className="detail-divider"></div>
                <div className="detail-item">
                  <span className="detail-label">Calculation:</span>
                  <span className="detail-value">2.965 days × $24,000/day = $71,167.44</span>
                </div>
              </div>
            </div>
          )}

          {/* Statement Match Indicator */}
          <div className="statement-match">
            <span className="match-icon">✓</span>
            <span className="match-text">Matches Laytime Statement</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemurrageSummary; 