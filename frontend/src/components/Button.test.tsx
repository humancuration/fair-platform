import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './common/Button2';

test('Button renders with correct label and handles click', () => {
  const handleClick = jest.fn();
  const { getByText } = render(<Button onClick={handleClick} label="Click Me" />);
  
  const buttonElement = getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();
  
  fireEvent.click(buttonElement);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
