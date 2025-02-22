import React from 'react';
import {useState, useEffect} from 'react'
import "../css/TodoUpdate.css"

function TodoUpdate({index, updateByIndex}) {
    const [data, setData] = React.useState("");

    const update = () => {
        if (!data) return;
        updateByIndex(index, data);
    }

    return (
        <div className="todo-update-container">
            <input onChange={(e) => setData(e.target.value)}/>
            <button onClick={update}>Change</button>
        </div>
    );
}

export default TodoUpdate;