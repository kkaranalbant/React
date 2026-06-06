import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoCreate from './TodoCreate';

describe('TodoCreate Component', () => {
    test('renders input and button', () => {
        render(<TodoCreate addTodo={() => {}} />);
        expect(screen.getByPlaceholderText('Enter TODO')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    });

    test('calls addTodo with input value when button is clicked', () => {
        const mockAddTodo = jest.fn();
        render(<TodoCreate addTodo={mockAddTodo} />);
        
        const input = screen.getByPlaceholderText('Enter TODO');
        const button = screen.getByRole('button', { name: 'Create' });

        fireEvent.change(input, { target: { value: 'New Task' } });
        fireEvent.click(button);

        expect(mockAddTodo).toHaveBeenCalledWith('New Task');
        expect(mockAddTodo).toHaveBeenCalledTimes(1);
    });

    test('does not error when input is empty and button is clicked', () => {
        const mockAddTodo = jest.fn();
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        render(<TodoCreate addTodo={mockAddTodo} />);
        
        const button = screen.getByRole('button', { name: 'Create' });
        fireEvent.click(button);

        expect(consoleSpy).toHaveBeenCalledWith("Name Can't Be Empty");
        expect(mockAddTodo).toHaveBeenCalledWith('');
        
        consoleSpy.mockRestore();
    });
});
