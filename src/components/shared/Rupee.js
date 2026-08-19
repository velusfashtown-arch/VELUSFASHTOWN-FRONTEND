import React from 'react';

// Playfair Display's ₹ glyph collides with the digit that follows it, so
// the symbol is rendered in the sans font (which has a properly-spaced
// one) while the amount keeps whatever display treatment the caller uses.
export default function Rupee({ amount, negative = false }) {
  return (
    <>
      {negative && '-'}
      <span className="font-sans mr-0.5">₹</span>
      {Math.round(Number(amount) || 0).toLocaleString('en-IN')}
    </>
  );
}
