import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WYSIWYGEditor from '../../modulesf/minsite/WYSIWYGEditor';

describe('WYSIWYGEditor', () => {
  test('renders editor and updates content on change', () => {
    const mockSetContent = jest.fn();
    render(<WYSIWYGEditor content="" setContent={mockSetContent} />);

    const editor = screen.getByPlaceholderText('Start creating your minisite content...');
    expect(editor).toBeInTheDocument();

    // Simulate user typing
    fireEvent.change(editor, { target: { value: '<p>Hello World</p>' } });
    expect(mockSetContent).toHaveBeenCalledWith('<p>Hello World</p>');
  });
});
