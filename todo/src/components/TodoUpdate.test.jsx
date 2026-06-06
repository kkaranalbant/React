import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoUpdate from './TodoUpdate';

describe('TodoUpdate Component', () => {
    test('renders input and button', () => {
        render(<TodoUpdate index={0} updateByIndex={() => {}} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Change' })).toBeInTheDocument();
    });

    test('calls updateByIndex with correct index and value', () => {
        const mockUpdateByIndex = jest.fn();
        render(<TodoUpdate index={2} updateByIndex={mockUpdateByIndex} />);
        
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: 'Change' });

        fireEvent.change(input, { target: { value: 'Updated Task' } });
        fireEvent.click(button);

        expect(mockUpdateByIndex).toHaveBeenCalledWith(2, 'Updated Task');
    });

    test('does not call updateByIndex if input is empty', () => {
        const mockUpdateByIndex = jest.fn();
        render(<TodoUpdate index={2} updateByIndex={mockUpdateByIndex} />);
        
        const button = screen.getByRole('button', { name: 'Change' });
        fireEvent.click(button);

        expect(mockUpdateByIndex).not.toHaveBeenCalled();
    });
});
