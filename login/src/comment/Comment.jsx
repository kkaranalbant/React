import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useDispatch} from "react-redux";

import './css/Comment.css'
import CommentEdit from "./CommentEdit";
import {deleteComment} from "../redux/comment/RemoveCommentReducer";
import {fetchCommentsByPostId} from "../redux/comment/CommentReducer";
import {dislikeComment, likeComment, setCommentId} from "../redux/comment/like/CommentLikeReducer";
import {reportComment} from "../redux/comment/CommentReportReducer";

const fetchCommentUrl = "http://localhost:8080/v1/comment/get?id="

function Comment({id, postId}) {

    const [data, setData] = useState(null)

    const [isEdit, setIsEdit] = useState(false)

    const dispatch = useDispatch()

    const [isLiked, setIsLiked] = useState(false)

    const [isReport, setIsReport] = useState(false)

    const [reportMessage, setReportMessage] = useState(null)

    useEffect(() => {
        const getComment = async () => {
            const response = await axios.get(fetchCommentUrl + id, {
                withCredentials: true
            })
            return response.data;
        }
        getComment().then((res) => {
            setData(res)
        })
    }, [id])

    const handleUpdateContext = async (context) => {
        // const newData = {
        //     ...data,
        //     context: context
        // }
        // setData(newData)
        const getComment = async () => {
            const response = await axios.get(fetchCommentUrl + id, {
                withCredentials: true
            })
            return response.data;
        }
        const data = await getComment();
        setData(data)
    }


    const handleDeleteComment = async () => {
        await dispatch(deleteComment(id))
        await dispatch(fetchCommentsByPostId(postId))
    }

    const handleLikeComment = async () => {
        await dispatch(setCommentId(id))
        await dispatch(likeComment())
        await dispatch(fetchCommentsByPostId(postId))
        data.liked = !data.liked
        setIsLiked(data.liked)
    }

    const handleDislikeComment = async () => {
        await dispatch(setCommentId(id))
        await dispatch(dislikeComment())
        await dispatch(fetchCommentsByPostId(postId))
        data.liked = !data.liked
        setIsLiked(data.liked)
    }

    const handleReport = async () => {
        console.log(reportMessage)
        await dispatch(reportComment(id , reportMessage))
    }


    if (!data) return null


    return (
        <div className="root-container">
            {/*{data.id}*/}
            {/*{data.authorResponse.userId}*/}
            <div className="info-container">
                <label>Author : {data.authorResponse.username}</label>
                {data.editted ? <label>(Edited)</label> : null}
                <label>Sent at : {data.sendingTime}</label>
            </div>
            <div>
                {data.context}
            </div>
            <div className="button-container">
                {data.canBeEditted ? <button onClick={() => setIsEdit(!isEdit)}>Edit Your Comment</button> : null}
                {data.canBeEditted ? <button onClick={() => handleDeleteComment()}>Delete</button> : null}
                {!data.liked ? <button onClick={() => handleLikeComment()}>Like</button> : null}
                {data.liked ? <button onClick={() => handleDislikeComment()}>Dislike</button> : null}
                <button onClick={() => setIsReport(!isReport)}>Report</button>
            </div>
            {isEdit && <CommentEdit id={data.id} handleUpdateContext={handleUpdateContext}/>}
            {isReport ?
                <div>
                    <label>Please Enter Report Explanation : </label>
                    <input type = "text" required={true} onChange={(e) => setReportMessage(e.target.value)} />
                    <button onClick={handleReport}>Send Report</button>
                </div> : null}
        </div>
    );

}

export default Comment;