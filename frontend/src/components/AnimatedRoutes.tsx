import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  onClick?: () => void;
  label: string;
  variant?: 'primary' | 'secondary';
}

const StyledButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  background: ${({ theme, variant }) => variant === 'primary' ? theme.primary : theme.secondary};
  color: ${({ theme }) => theme.text};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;

  &:hover {
    transform: scale(1.05);
    background-color: ${({ theme, variant }) => variant === 'primary' ? theme.secondary : theme.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Button: React.FC<ButtonProps> = ({ onClick, label, variant = 'primary' }) => (
  <StyledButton onClick={onClick} variant={variant}>
    {label}
  </StyledButton>
);

export default Button;