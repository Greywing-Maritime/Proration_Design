// File: src/components/PortQasimAttributionTable.js
// Purpose: Displays detailed time attribution table for Port Qasim showing how time is allocated between charterers

import React, { useMemo } from 'react';
import './PortQasimAttributionTable.css';

const PortQasimAttributionTable = ({ portData, isExpanded = false }) => {
  // Parse date/time string to Date object
  const parseDateTime = (dateTimeStr) => {
    // Format: "DD MMM HH:MM" e.g., "12 May 05:45"
    const [day, month, time] = dateTimeStr.split(' ');
    const [hours, minutes] = time.split(':');
    
    const monthMap = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    // Assuming year 2024 based on the data
    const year = 2024;
    return new Date(year, monthMap[month], parseInt(day), parseInt(hours), parseInt(minutes));
  };

  // Calculate hours between two dates
  const calculateHoursBetween = (startStr, endStr) => {
    const start = parseDateTime(startStr);
    const end = parseDateTime(endStr);
    const diffMs = end - start;
    return diffMs / (1000 * 60 * 60); // Convert to hours
  };

  // Format duration from decimal hours to "XXh YYm" format
  const formatDuration = (decimalHours) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    
    if (hours === 0 && minutes === 0) return '0m';
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  // Calculate the attribution table
  const attributionData = useMemo(() => {
    if (!portData || !portData.timeline) return null;

    // Extract key events from timeline
    const timeline = portData.timeline;
    const keyEvents = {};

    // Map event descriptions to key event names
    timeline.forEach(event => {
      if (event.event.includes('Notice of Readiness')) {
        keyEvents.norTendered = event.time;
      } else if (event.event.includes('Laytime Can Commence') || event.event.includes('Laytime Commences')) {
        keyEvents.laytimeCommenced = event.time;
      } else if (event.event === 'Commenced Shifting') {
        keyEvents.anchorAweigh = event.time;
      } else if (event.event === 'Made Fast at Berth') {
        keyEvents.madeFast = event.time;
      } else if (event.event === 'All Preparations Complete') {
        // This is when the vessel is ready but waiting
        keyEvents.allPreparationsComplete = event.time;
      } else if (event.event === 'Commenced Discharge of Others') {
        // This is the actual start of others' discharge operations at 16 May 19:15
        // In the laytime statement, this corresponds to "COM'CED DISCH OF OTHERS"
        keyEvents.othersCommenced = event.time;
      } else if (event.event === '5S,6P Hose Connected (UNILEVER)') {
        // This is when UNILEVER's operations commence for laytime purposes
        // In the laytime statement, this corresponds to "COM'CED DISCH" for UNILEVER
        keyEvents.unileverCommenced = event.time;
      } else if (event.event.includes('Squeegeeing') && event.event.includes('Deduction')) {
        keyEvents.squeegeeingStarted = event.time;
        // Find the duration to calculate end time
        if (event.duration) {
          const durationMinutes = parseInt(event.duration);
          const startDate = parseDateTime(event.time);
          const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
          keyEvents.squeegeeingEnded = `${endDate.getDate()} May ${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
        }
      } else if (event.event.includes('Operations Complete') && event.event.includes('UNILEVER')) {
        keyEvents.hoseDisconnected = event.time;
      }
    });

    // Debug log to verify events
    console.log('Key Events Extracted:', keyEvents);

    // Define proration percentages based on cargo volumes
    const unileverVolume = 3003.315;
    const othersVolume = 20001.223;
    const totalVolume = unileverVolume + othersVolume;
    const unileverShare = unileverVolume / totalVolume; // 0.130553
    const othersShare = othersVolume / totalVolume; // 0.869447

    // Define time periods
    const timePeriods = [
      {
        name: "Waiting for Berth",
        start: keyEvents.laytimeCommenced,
        end: keyEvents.anchorAweigh,
        allocation: "PRORATED",
        unileverShare: unileverShare,
        othersShare: othersShare
      },
      {
        name: "Shifting",
        start: keyEvents.anchorAweigh,
        end: keyEvents.madeFast,
        allocation: "EXCLUDED",
        unileverShare: 0.0,
        othersShare: 0.0
      },
      {
        name: "Waiting at Berth",
        start: keyEvents.madeFast,
        end: keyEvents.othersCommenced,
        allocation: "PRORATED",
        unileverShare: unileverShare,
        othersShare: othersShare
      },
      {
        name: "Others' Operations",
        start: keyEvents.othersCommenced,
        end: keyEvents.unileverCommenced,
        allocation: "FULL_TO_OTHERS",
        unileverShare: 0.0,
        othersShare: 1.0
      },
      {
        name: "UNILEVER Operations",
        start: keyEvents.unileverCommenced,
        end: keyEvents.hoseDisconnected,
        allocation: "FULL_TO_UNILEVER",
        unileverShare: 1.0,
        othersShare: 0.0
      }
    ];

    // Calculate attribution for each period
    const rows = [];
    let totalUnileverHours = 0;
    let totalOthersHours = 0;
    let totalGrossHours = 0;

    timePeriods.forEach(period => {
      if (!period.start || !period.end) return;

      const grossDuration = calculateHoursBetween(period.start, period.end);
      let unileverTime = grossDuration * period.unileverShare;
      let othersTime = grossDuration * period.othersShare;
      let note = '';

      switch (period.allocation) {
        case "PRORATED":
          note = `(${(period.unileverShare * 100).toFixed(2)}% / ${(period.othersShare * 100).toFixed(2)}%)`;
          break;
        case "FULL_TO_UNILEVER":
          note = "(100% to UNILEVER)";
          break;
        case "FULL_TO_OTHERS":
          note = "(Excluded from UNILEVER)";
          break;
        case "EXCLUDED":
          note = "(Excluded from laytime)";
          break;
      }

      // Special handling for UNILEVER Operations - subtract squeegeeing
      if (period.name === "UNILEVER Operations" && keyEvents.squeegeeingStarted && keyEvents.squeegeeingEnded) {
        const squeegeeingDuration = calculateHoursBetween(keyEvents.squeegeeingStarted, keyEvents.squeegeeingEnded);
        unileverTime -= squeegeeingDuration;
        note += ` Less: ${formatDuration(squeegeeingDuration)} squeegeeing`;
      }

      rows.push({
        periodName: period.name,
        timeRange: `${period.start} - ${period.end}`,
        grossDuration: grossDuration,
        unileverTime: unileverTime,
        othersTime: othersTime,
        note: note
      });

      totalUnileverHours += unileverTime;
      totalOthersHours += othersTime;
      totalGrossHours += grossDuration;
    });

    // Validation
    const expectedUnileverHours = 21.65; // 21h 39m
    const isValid = Math.abs(totalUnileverHours - expectedUnileverHours) < 0.02; // Allow 1.2 minutes tolerance

    return {
      rows,
      totals: {
        gross: totalGrossHours,
        unilever: totalUnileverHours,
        others: totalOthersHours
      },
      validation: {
        isValid,
        expected: expectedUnileverHours,
        actual: totalUnileverHours,
        difference: totalUnileverHours - expectedUnileverHours
      },
      prorationPercentages: {
        unilever: (unileverShare * 100).toFixed(2),
        others: (othersShare * 100).toFixed(2)
      }
    };
  }, [portData]);

  if (!attributionData) return null;

  return (
    <div className={`attribution-table-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <h5 className="attribution-title">PORT QASIM TIME ATTRIBUTION</h5>
      
      <div className="attribution-table">
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Duration</th>
              <th>UNILEVER</th>
              <th>Others</th>
              <th>Allocation Method</th>
            </tr>
          </thead>
          <tbody>
            {attributionData.rows.map((row, index) => (
              <tr key={index}>
                <td className="period-cell">
                  <div className="period-name">{row.periodName}</div>
                  <div className="time-range">{row.timeRange}</div>
                </td>
                <td className="duration-cell">{formatDuration(row.grossDuration)}</td>
                <td className="unilever-cell">{formatDuration(row.unileverTime)}</td>
                <td className="others-cell">{formatDuration(row.othersTime)}</td>
                <td className="method-cell">{row.note}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td>TOTAL</td>
              <td>{formatDuration(attributionData.totals.gross)}</td>
              <td>{formatDuration(attributionData.totals.unilever)}</td>
              <td>{formatDuration(attributionData.totals.others)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="validation-section">
        <div className={`validation-status ${attributionData.validation.isValid ? 'valid' : 'invalid'}`}>
          {attributionData.validation.isValid ? '✓' : '⚠'} 
          {attributionData.validation.isValid ? 'Matches' : 'Does not match'} Laytime Statement 
          (Expected: {formatDuration(attributionData.validation.expected)}, 
          Actual: {formatDuration(attributionData.validation.actual)})
        </div>
      </div>

      <div className="proration-note">
        <strong>Proration Basis:</strong> UNILEVER {attributionData.prorationPercentages.unilever}% 
        ({3003.315.toLocaleString()} MT) / Others {attributionData.prorationPercentages.others}% 
        ({20001.223.toLocaleString()} MT)
      </div>
    </div>
  );
};

export default PortQasimAttributionTable; 