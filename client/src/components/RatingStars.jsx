import React from 'react';

export default function RatingStars({ value = 0, onChange }) {
  const stars = [1,2,3,4,5];
  return (
    <div>
      {stars.map(s => (
        <span key={s} style={{ cursor: 'pointer', fontSize: 20, marginRight: 4 }}
          onClick={() => onChange && onChange(s)}>{ s <= value ? '★' : '☆' }</span>
      ))}
    </div>
  );
}
