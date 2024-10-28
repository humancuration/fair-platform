// Example: src/components/StyledLink.tsx

import styled from 'styled-components';

const StyledLink = styled.a`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.secondary};
  }

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: ${({ theme }) => theme.secondary};
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  &:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

export default StyledLink;
