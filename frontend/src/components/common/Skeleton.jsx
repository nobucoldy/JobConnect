import React from 'react';
import './Skeleton.css';

const Skeleton = ({ height = '20px', width = '100%', count = 1, className = '' }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`skeleton ${className}`}
          style={{ height, width }}
        ></div>
      ))}
    </>
  );
};

export default Skeleton;
