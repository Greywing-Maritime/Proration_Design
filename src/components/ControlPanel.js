import React from 'react';

const ControlPanel = ({ children }) => {
  return (
    <div className="control-panel-container">
      {/* This component now serves as a container for other visual elements */}
      {/* All control functionality has been moved to CollapsibleControlModal */}
      {children}
    </div>
  );
};

export default ControlPanel; 