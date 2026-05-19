import React from 'react';
import './Rating.css';

const Rating = ({ value = 0, onChange, readOnly = false, size = 'md' }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={`rating rating-${size} ${readOnly ? 'rating-readonly' : 'rating-interactive'}`}>
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? 'star-filled' : 'star-empty'}`}
          onClick={() => handleClick(star)}
          role={readOnly ? 'img' : 'button'}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          tabIndex={readOnly ? -1 : 0}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
