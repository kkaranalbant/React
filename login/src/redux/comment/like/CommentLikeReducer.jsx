import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from 'axios'


const initialState = {
    commentId: null,
}

const likeCommentUrl = "http://localhost:8080/v1/comment-like/like?id="
const dislikeCommentUrl = "http://localhost:8080/v1/comment-like/dislike?id="

export const likeComment = createAsyncThunk("CommentLikeReducer/likeComment", async (_, {
    getState,
    rejectWithValue
}) => {
    const state = getState();
    try {
        const response = await axios.post(likeCommentUrl + state.commentLikeReducer.commentId, {}, {
            withCredentials: true
        })
        if (response.status !== 200) {
            return rejectWithValue(response.data)
        }
        return response.data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const dislikeComment = createAsyncThunk("CommentLikeReducer/dislikeComment", async (_, {
    getState,
    rejectWithValue
}) => {
    const state = getState();
    try {
        const response = await axios.delete(dislikeCommentUrl + state.commentLikeReducer.commentId, {
            withCredentials: true
        })
        if (response.status !== 200) {
            return rejectWithValue(response.data)
        }
        return response.data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})


const commentLikeReducer = createSlice({
    name: "commentLikeReducer",
    initialState: initialState,
    reducers: {
        setCommentId: (state, action) => {
            state.commentId = action.payload
        }
    }
})

export default commentLikeReducer.reducer

export const {setCommentId} = commentLikeReducer.actions