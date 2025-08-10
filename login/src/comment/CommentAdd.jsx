import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addComment, setContext, setPostId} from "../redux/comment/AddCommentReducer";

function CommentAdd({postId , handleAddComment}) {

    const dispatch = useDispatch();

    dispatch(setPostId(postId))

    const handleSubmit = async () => {
        await dispatch(addComment());
        handleAddComment()
    }

    return (
        <div>
            <input type ="text" onChange={e => dispatch(setContext(e.currentTarget.value))}/>
            <button onClick={handleSubmit}>Add Comment</button>
        </div>
    );
}

export default CommentAdd;