import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import styled from 'styled-components';
import { Theme } from '../../styles/theme'; // Assuming you have a theme file

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
}

const StyledButton = styled.button<ButtonProps>`
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary :
    variant === 'secondary' ? theme.colors.secondary :
    'transparent'};
  color: ${({ theme, variant }) =>
    variant === 'tertiary' ? theme.colors.primary : theme.colors.text};
  padding: ${({ size }) =>
    size === 'small' ? '0.25rem 0.5rem' :
    size === 'large' ? '0.75rem 1.5rem' :
    '0.5rem 1rem'};
  font-size: ${({ theme, size }) =>
    size === 'small' ? theme.fontSizes.small :
    size === 'large' ? theme.fontSizes.large :
    theme.fontSizes.medium};
  border: ${({ variant, theme }) => variant === 'tertiary' ? `1px solid ${theme.colors.primary}` : 'none'};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme, variant }) =>
      variant === 'primary' ? theme.colors.primaryHover :
      variant === 'secondary' ? theme.colors.secondaryHover :
      theme.colors.tertiaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'medium',
  ...rest
}, ref) => {
  return (
    <StyledButton 
      ref={ref}
      variant={variant}
      size={size}
      {...rest}
    >
      {children}
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;
