import React from 'react';
import Todo from './Todo'
import '../css/TodoList.css'

function TodoList({todos, removeByIndex, updateByIndex}) {

    return (
        <div className="todo-list-container">
            <h1>My TODO List</h1>
            {todos.map((todo, index) => (
                <Todo key= {index}
                      name={todo}
                      index={index}
                      removeByIndex={removeByIndex}
                      updateByIndex={updateByIndex}
                />
            ))}
        </div>
    );
}

export default TodoList;