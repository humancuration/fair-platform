import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<ButtonProps>`
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.primary : theme.secondary};
  color: ${({ theme }) => theme.text};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme, variant }) =>
      variant === 'primary' ? theme.secondary : theme.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className,
}) => {
  return (
    <StyledButton onClick={onClick} variant={variant} className={className}>
      {children}
    </StyledButton>
  );
};

export default Button;
