import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios'


const deleteCommentUrl = "http://localhost:8080/v1/comment/delete?id="

export const deleteComment = createAsyncThunk("RemoveCommentReducer/deleteComment", async (id, {rejectWithValue}) => {
    try {
        const response = await axios.delete(deleteCommentUrl + id, {
            withCredentials: true
        })
        if (response.status !== 200) {
            rejectWithValue(response.statusText);
        }
        return response.data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})
