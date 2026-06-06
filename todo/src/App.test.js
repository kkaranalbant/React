import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Todo Component', () => {
  test('renders the input and create button', () => {
    render(<App />);
    const headingElement = screen.getByText(/Enter TODO/i);
    expect(headingElement).toBeInTheDocument();
    
    const inputElement = screen.getByPlaceholderText(/Enter TODO/i);
    expect(inputElement).toBeInTheDocument();

    const buttonElement = screen.getByText(/Create/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('can add a new todo', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText(/Enter TODO/i);
    const buttonElement = screen.getByText(/Create/i);

    // Type a new todo
    fireEvent.change(inputElement, { target: { value: 'Learn React Testing' } });
    
    // Click the Create button
    fireEvent.click(buttonElement);

    // Verify that the new todo is added to the list
    const newTodoElement = screen.getByText(/Learn React Testing/i);
    expect(newTodoElement).toBeInTheDocument();
  });
});
