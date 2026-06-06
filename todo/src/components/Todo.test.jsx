import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Todo from './Todo';

describe('Todo Component', () => {
    test('renders todo name', () => {
        render(<Todo name="Sample Task" index={1} removeByIndex={() => {}} updateByIndex={() => {}} />);
        expect(screen.getByText('Sample Task')).toBeInTheDocument();
    });

    test('calls removeByIndex when remove icon is clicked', () => {
        const mockRemoveByIndex = jest.fn();
        const { container } = render(<Todo name="Sample Task" index={3} removeByIndex={mockRemoveByIndex} updateByIndex={() => {}} />);
        
        const removeIcon = container.querySelectorAll('.todo-icons')[0];
        
        fireEvent.click(removeIcon);
        
        expect(mockRemoveByIndex).toHaveBeenCalledWith(3);
    });

    test('toggles TodoUpdate component when edit icon is clicked', () => {
        const { container } = render(<Todo name="Sample Task" index={3} removeByIndex={() => {}} updateByIndex={() => {}} />);
        
        const editIcon = container.querySelectorAll('.todo-icons')[1];
        
        expect(screen.queryByRole('button', { name: 'Change' })).not.toBeInTheDocument();
        
        fireEvent.click(editIcon);
        expect(screen.getByRole('button', { name: 'Change' })).toBeInTheDocument();
        
        fireEvent.click(editIcon);
        expect(screen.queryByRole('button', { name: 'Change' })).not.toBeInTheDocument();
    });
});
