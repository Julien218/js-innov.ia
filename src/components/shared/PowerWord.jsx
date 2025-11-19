import React from 'react';

export default function PowerWord({ children, className = '' }) {
  return (
    <span className={`power-word ${className}`}>
      {children}
    </span>
  );
}