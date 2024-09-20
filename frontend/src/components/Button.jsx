// components/Button.jsx
import React from 'react';

const Button = ({ onClick, label }) => (
  <button onClick={onClick} className="btn">
    {label}
  </button>
);

export default Button;
