import React, {useState} from 'react';
import '../css/TodoCreate.css'

function TodoCreate({addTodo}) {

    const [newTodoName, setNewTodoName] = useState("")
    const createTodo = () => {
        if (!newTodoName) console.log("Name Can't Be Empty")
        addTodo(newTodoName)
    }

    return (
        <div className="div-container">
            <h1>Enter TODO</h1>
            <input type="text" placeholder="Enter TODO" onChange={(e) => {
                setNewTodoName(e.target.value)
            }}/>
            <button onClick={createTodo}>Create</button>
        </div>
    );
}

export default TodoCreate;