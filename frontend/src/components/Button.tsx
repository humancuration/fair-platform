import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  onClick: () => void;
  label: string;
}

const StyledButton = styled.button`
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

const Button: React.FC<ButtonProps> = ({ onClick, label }) => (
  <StyledButton onClick={onClick}>
    {label}
  </StyledButton>
);

export default Button;
