import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, setUserMessage} from "../redux/UserDeleteReducer";
import './css/UserDelete.css'

function UserDelete(props) {
    const {confirmingMessage} = useSelector(store => store.userDeleteReducer)
    const dispatch = useDispatch();
    return (
        <div className="div-container">
            <div>
                <p>If You Really Want to Delete Your Account Please Write 'DELETE MY ACCOUNT' and Press the Button</p>
                <input type="text" name="confirmingMessage" onChange={(e) => setUserMessage(e.target.value)} />
            </div>
            <button onClick={() => dispatch(deleteUser())}>Delete</button>
        </div>
    );
}

export default UserDelete;