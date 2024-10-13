// components/Button.jsx
import React from 'react';
import styled from 'styled-components';

const ButtonComponent = ({ onClick, label }) => (
  <button onClick={onClick} className="btn">
    {label}
  </button>
);
const Button = styled(ButtonComponent)`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;

  &:hover {
    transform: scale(1.05);
    background-color: ${({ theme }) => theme.secondary};
  }

  &:active {
    transform: scale(0.95);
  }
`;
export default Button;
