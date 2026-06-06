import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from './TodoList';

describe('TodoList Component', () => {
    test('renders heading', () => {
        render(<TodoList todos={[]} removeByIndex={() => {}} updateByIndex={() => {}} />);
        expect(screen.getByText('My TODO List')).toBeInTheDocument();
    });

    test('renders a list of todos', () => {
        const todos = ['Task 1', 'Task 2', 'Task 3'];
        render(<TodoList todos={todos} removeByIndex={() => {}} updateByIndex={() => {}} />);
        
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
        expect(screen.getByText('Task 3')).toBeInTheDocument();
    });
});
