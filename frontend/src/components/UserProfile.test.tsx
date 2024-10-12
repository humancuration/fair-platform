import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserProfile from './UserProfile';

test('renders user profile with name and email', () => {
  const user = { name: 'John Doe', email: 'john@example.com' };
  const { getByText } = render(<UserProfile user={user} onEdit={() => {}} />);
  
  expect(getByText('John Doe')).toBeInTheDocument();
  expect(getByText('Email: john@example.com')).toBeInTheDocument();
});

test('calls onEdit when Edit Profile button is clicked', () => {
  const user = { name: 'John Doe', email: 'john@example.com' };
  const onEditMock = jest.fn();
  const { getByText } = render(<UserProfile user={user} onEdit={onEditMock} />);
  
  fireEvent.click(getByText('Edit Profile'));
  expect(onEditMock).toHaveBeenCalledTimes(1);
});
