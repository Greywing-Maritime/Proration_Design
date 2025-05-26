// File: src/components/PortAnalysisPanel.js
// Purpose: Modular right sidebar with multiple focused panels for port analysis
// This component displays contextual information synchronized with the main visualization

import React, { useState, useEffect } from 'react';
import './PortAnalysisPanel.css';
import { portOperations, cargoTypes } from '../data/cargoData';

const PortAnalysisPanel = ({ activePort, activeCharterer, portInView }) => {
  const [currentPort, setCurrentPort] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    timeline: true,
    cargo: true,
    proration: true
  });

  // Determine which port to display based on priority
  useEffect(() => {
    // Priority: specific port selection > port in view > first port
    if (activePort && activePort !== 'all') {
      setCurrentPort(activePort);
    } else if (portInView && portInView !== 'all') {
      setCurrentPort(portInView);
    } else {
      // Default to first port if nothing selected
      const firstPort = Object.keys(portOperations)[0];
      setCurrentPort(firstPort);
    }
  }, [activePort, portInView]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!currentPort || !portOperations[currentPort]) {
    return (
      <div className="port-analysis-panel">
        <div className="panel-header">
          <h3>Port Analysis</h3>
          <div className="sync-status">
            <span className="sync-icon">🔄</span>
            <span>No port selected</span>
          </div>
        </div>
      </div>
    );
  }

  const portData = portOperations[currentPort];
  
  // Get cargoes at this port
  const portCargoes = Object.entries(cargoTypes).filter(([id, cargo]) => 
    cargo.ports.includes(currentPort)
  );
  
  const unileverCargoes = portCargoes.filter(([id, cargo]) => 
    cargo.charterer === 'UNILEVER'
  );
  
  const otherCargoes = portCargoes.filter(([id, cargo]) => 
    cargo.charterer === 'OTHER'
  );

  // Calculate time statistics
  const calculateTimeStats = () => {
    const stats = {
      waiting: 0,
      laytime: 0,
      deductions: 0,
      nonUnilever: 0
    };

    portData.timeline.forEach(event => {
      if (event.duration && event.duration !== '0m' && event.duration !== 'ongoing') {
        const minutes = parseDuration(event.duration);
        switch (event.timeType) {
          case 'waiting':
            stats.waiting += minutes;
            break;
          case 'laytime':
            stats.laytime += minutes;
            break;
          case 'deduction':
            stats.deductions += minutes;
            break;
          case 'non-unilever':
            stats.nonUnilever += minutes;
            break;
        }
      }
    });

    return stats;
  };

  const parseDuration = (duration) => {
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
    
    return totalMinutes;
  };

  const formatMinutes = (minutes) => {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0) parts.push(`${mins}m`);
    
    return parts.join(' ') || '0m';
  };

  const timeStats = calculateTimeStats();

  return (
    <div className="port-analysis-panel">
      {/* Header with sync status */}
      <div className="panel-header">
        <h3>Port Analysis</h3>
        <div className="sync-status">
          {activePort === 'all' && portInView ? (
            <>
              <span className="sync-icon active">📍</span>
              <span>Auto-synced</span>
            </>
          ) : (
            <>
              <span className="sync-icon">🎯</span>
              <span>Fixed view</span>
            </>
          )}
        </div>
      </div>

      {/* Current Port Display */}
      <div className="current-port-display">
        <h2>{currentPort}</h2>
        <div className="port-meta">
          <span className="country">{portData.country}</span>
          <span className="berth">Berth: {portData.berth}</span>
        </div>
      </div>

      {/* Port Overview Section */}
      <div className={`panel-section ${expandedSections.overview ? 'expanded' : 'collapsed'}`}>
        <div className="section-header" onClick={() => toggleSection('overview')}>
          <h4>
            <span className="section-icon">📊</span>
            Port Overview
          </h4>
          <span className="toggle-icon">{expandedSections.overview ? '−' : '+'}</span>
        </div>
        {expandedSections.overview && (
          <div className="section-content">
            <div className="overview-grid">
              <div className="overview-item">
                <span className="label">Total Events</span>
                <span className="value">{portData.timeline.length}</span>
              </div>
              <div className="overview-item">
                <span className="label">Charterers</span>
                <span className="value">
                  {unileverCargoes.length > 0 && otherCargoes.length > 0 ? 'Multiple' : 
                   unileverCargoes.length > 0 ? 'UNILEVER' : 'OTHER'}
                </span>
              </div>
              <div className="overview-item">
                <span className="label">Total Cargoes</span>
                <span className="value">{portCargoes.length}</span>
              </div>
              <div className="overview-item">
                <span className="label">Port Type</span>
                <span className="value">
                  {currentPort === 'Kuala Tanjung' ? 'Loading' : 'Discharging'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time Analysis Section */}
      <div className={`panel-section ${expandedSections.timeline ? 'expanded' : 'collapsed'}`}>
        <div className="section-header" onClick={() => toggleSection('timeline')}>
          <h4>
            <span className="section-icon">⏱️</span>
            Time Analysis
          </h4>
          <span className="toggle-icon">{expandedSections.timeline ? '−' : '+'}</span>
        </div>
        {expandedSections.timeline && (
          <div className="section-content">
            <div className="time-breakdown">
              {timeStats.waiting > 0 && (
                <div className="time-item waiting">
                  <span className="time-label">Waiting Time</span>
                  <span className="time-value">{formatMinutes(timeStats.waiting)}</span>
                </div>
              )}
              {timeStats.laytime > 0 && (
                <div className="time-item laytime">
                  <span className="time-label">Laytime Used</span>
                  <span className="time-value">{formatMinutes(timeStats.laytime)}</span>
                </div>
              )}
              {timeStats.deductions > 0 && (
                <div className="time-item deduction">
                  <span className="time-label">Deductions</span>
                  <span className="time-value">{formatMinutes(timeStats.deductions)}</span>
                </div>
              )}
              {timeStats.nonUnilever > 0 && (
                <div className="time-item non-unilever">
                  <span className="time-label">Other Charterer Time</span>
                  <span className="time-value">{formatMinutes(timeStats.nonUnilever)}</span>
                </div>
              )}
            </div>
            
            {/* Laytime calculation if available */}
            {portData.laytimeCalculation && (
              <div className="laytime-calc">
                <h5>Laytime Calculation</h5>
                {portData.laytimeCalculation.totalLaytime && (
                  <div className="calc-item">
                    <span>Total Laytime:</span>
                    <span>{portData.laytimeCalculation.totalLaytime}</span>
                  </div>
                )}
                {portData.laytimeCalculation.netLaytime && (
                  <div className="calc-item">
                    <span>Net Laytime:</span>
                    <span>{portData.laytimeCalculation.netLaytime}</span>
                  </div>
                )}
                {portData.laytimeCalculation.unileverShare && (
                  <div className="calc-item">
                    <span>UNILEVER Share:</span>
                    <span>{portData.laytimeCalculation.unileverShare}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cargo Operations Section */}
      <div className={`panel-section ${expandedSections.cargo ? 'expanded' : 'collapsed'}`}>
        <div className="section-header" onClick={() => toggleSection('cargo')}>
          <h4>
            <span className="section-icon">📦</span>
            Cargo Operations
          </h4>
          <span className="toggle-icon">{expandedSections.cargo ? '−' : '+'}</span>
        </div>
        {expandedSections.cargo && (
          <div className="section-content">
            {unileverCargoes.length > 0 && (
              <div className="cargo-group">
                <h5 className="cargo-group-title unilever">UNILEVER Cargoes</h5>
                {unileverCargoes.map(([id, cargo]) => (
                  <div key={id} className="cargo-item">
                    <div className="cargo-header">
                      <span className="cargo-name" style={{ color: cargo.color }}>
                        {cargo.name}
                      </span>
                      <span className="cargo-tanks">{cargo.tankDesignation}</span>
                    </div>
                    <div className="cargo-details">
                      <span className="cargo-quantity">{cargo.quantity}</span>
                      <span className="cargo-operation">
                        {cargo.loadPort === currentPort ? '↑ Loading' : '↓ Discharging'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {otherCargoes.length > 0 && (
              <div className="cargo-group">
                <h5 className="cargo-group-title other">OTHER Charterer Cargoes</h5>
                {otherCargoes.map(([id, cargo]) => (
                  <div key={id} className="cargo-item">
                    <div className="cargo-header">
                      <span className="cargo-name" style={{ color: cargo.color }}>
                        {cargo.name}
                      </span>
                      <span className="cargo-tanks">{cargo.tankDesignation}</span>
                    </div>
                    <div className="cargo-details">
                      <span className="cargo-quantity">{cargo.quantity}</span>
                      <span className="cargo-operation">↓ Discharging</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Proration Analysis Section (for multi-charterer ports) */}
      {otherCargoes.length > 0 && unileverCargoes.length > 0 && (
        <div className={`panel-section ${expandedSections.proration ? 'expanded' : 'collapsed'}`}>
          <div className="section-header" onClick={() => toggleSection('proration')}>
            <h4>
              <span className="section-icon">⚖️</span>
              Proration Analysis
            </h4>
            <span className="toggle-icon">{expandedSections.proration ? '−' : '+'}</span>
          </div>
          {expandedSections.proration && (
            <div className="section-content">
              <div className="proration-info">
                <p className="proration-explanation">
                  This is a multi-charterer port. Time and costs are shared between charterers based on cargo operations.
                </p>
                
                <div className="charterer-breakdown">
                  <div className="charterer-item unilever">
                    <span className="charterer-name">UNILEVER</span>
                    <span className="charterer-cargoes">{unileverCargoes.length} cargo(es)</span>
                  </div>
                  <div className="charterer-item other">
                    <span className="charterer-name">OTHER</span>
                    <span className="charterer-cargoes">{otherCargoes.length} cargo(es)</span>
                  </div>
                </div>
                
                <div className="proration-note">
                  <span className="note-icon">ℹ️</span>
                  <span>Waiting time and port costs are prorated based on the "block time minus deductions" methodology.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transit Information */}
      {portData.transitToNext && (
        <div className="transit-info">
          <span className="transit-icon">🚢</span>
          <span>Next: {portData.transitToNext.destination}</span>
          <span className="transit-duration">({portData.transitToNext.duration})</span>
        </div>
      )}
    </div>
  );
};

export default PortAnalysisPanel; 