import React, { useState } from 'react';

const CustomTooltip = ({ children, content }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute z-10 p-2 text-sm text-white bg-gray-800 rounded-md shadow-lg -top-12 -translate-x-1/2 right-1 whitespace-nowrap">
          
          {content}
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;