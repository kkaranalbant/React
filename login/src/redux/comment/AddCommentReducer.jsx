import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from 'axios'


const initialState = {
    postId : null ,
    context : null ,
}

const addCommentUrl = "http://localhost:8080/v1/comment/add"

export const addComment = createAsyncThunk("AddCommentReducer/addComment", async (_, {getState,rejectWithValue}) => {
    const state = getState();
    const payload = {
        postId : state.addCommentReducer.postId,
        context : state.addCommentReducer.context
    }
    try {
        const response = await axios.post("http://localhost:8080/v1/comment/add", payload , {
            withCredentials: true
        })
        if (response.status !== 200) {
            return rejectWithValue(response.data)
        }
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.message)
    }
})

const addCommentReducer = createSlice({
    name: "addCommentReducer",
    initialState: initialState,
    reducers: {
        setPostId: (state, action) => {
            state.postId = action.payload
        },
        setContext: (state, action) => {
            state.context = action.payload
        }
    }
})

export default addCommentReducer.reducer ;

export const {setPostId , setContext} = addCommentReducer.actions;