import React from 'react';
import {IoIosRemoveCircle} from "react-icons/io";
import {MdEdit} from "react-icons/md";
import "../css/Todo.css"
import TodoUpdate from "./TodoUpdate";

function Todo({name, index, removeByIndex, updateByIndex}) {
    const [isEditting, setIsEditting] = React.useState(false);
    return (
        <div id={index} className="todo-div-container">
            <div className="todo-name">
                {name}
            </div>
            <div id={index} className="todo-icon-container">
                <IoIosRemoveCircle className="todo-icons" onClick={() => removeByIndex(index)}/>
                <MdEdit className="todo-icons" onClick={() => (setIsEditting(!isEditting))}/>
            </div>
            {
                isEditting && <TodoUpdate key={index} updateByIndex={updateByIndex} index={index}/>
            }
        </div>
    )
        ;
}

export default Todo;