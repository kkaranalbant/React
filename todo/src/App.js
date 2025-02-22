import logo from './logo.svg';
import './App.css';
import TodoCreate from "./components/TodoCreate";
import TodoList from "./components/TodoList"
import {useState} from "react";

function App() {

    const [todo, setTodo] = useState([])

    const addTodo = (newTodo) => {
        setTodo([...todo, newTodo])
        console.log(todo)
    }

    const removeByIndex = (index) => {
        const newArray = todo.filter((element, indexx) => indexx !== index)
        setTodo(newArray)
    }

    const updateByIndex = (index, value) => {
        const updatedTodos = todo.map((item, i) =>
            i === index ? value : item
        );
        setTodo(updatedTodos);
    };


    return (
        <div className="App">
            <TodoCreate addTodo={addTodo}/>
            <TodoList todos={todo} removeByIndex={removeByIndex} updateByIndex={updateByIndex}/>
        </div>
    );
}

export default App;
