import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {updateComment} from "../redux/comment/CommentReducer";

function CommentEdit({id, handleUpdateContext}) {
    const [context, setContext] = useState('');
    const dispatch = useDispatch();
    const handleSubmit = async () => {
        await dispatch(updateComment({id, context}))
        await handleUpdateContext(context);
    }
    return (
        <div>
            <label>Please Edit Your Comment:</label>
            <input value={context} onChange={(e) => setContext(e.target.value)}/>
            <button onClick={() => handleSubmit()}>Edit</button>
        </div>
    );
}

export default CommentEdit;