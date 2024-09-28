// Example: src/components/Header.tsx

import styled from 'styled-components';

const Header = styled.header`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  padding: 1rem;
  text-align: center;
`;

export default Header;
