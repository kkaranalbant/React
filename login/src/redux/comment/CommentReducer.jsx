import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    commentData: null,
    userId: null,
    userCommentsData: null,
    postId: null,
    postCommentsData: null,
    errorMessage: null
}


const fetchCommentsByPostIdUrl = "http://localhost:8080/v1/comment/get-post?id="

const fetchCommentsByUserIdUrl = "http://localhost:8080/v1/comment/get-user?id="

const updateCommentUrl = "http://localhost:8080/v1/comment/update"


export const fetchCommentsByUserId = createAsyncThunk("CommentReducer/fetchCommentsByUserId",
    async (_, {getState, rejectWithValue}) => {
        const state = getState()
        try {
            const response = await axios.get(fetchCommentsByUserIdUrl + state.commentReducer.userId, {
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

export const updateComment = createAsyncThunk("CommentReducer/updateComments", async ({id , context} , {getState , rejectWithValue}) => {
    try {
        const state = getState() ;
        const payload = {
            id : id ,
            context : context
        }
        const response = await axios.post(updateCommentUrl,  payload ,{
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

export const fetchCommentsByPostId = createAsyncThunk("CommentReducer/fetchCommentsByPostId",
    async (id, {getState, rejectWithValue}) => {
        const state = getState()
        try {
            const response = await axios.get(fetchCommentsByPostIdUrl + id, {
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

const commentReducer = createSlice({
    name: "commentReducer",
    initialState: initialState,
    reducers: {
        setCommentId(state, action) {
            state.commentId = action.payload
        },
        setUserId(state, action) {
            state.userId = action.payload
        },
        setPostId(state, action) {
            state.postId = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCommentsByUserId.fulfilled, (state, action) => {
            state.userCommentsData = action.payload
        })
        builder.addCase(fetchCommentsByUserId.rejected, (state, action) => {
            state.errorMessage = action.payload
        })
        builder.addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
            state.postCommentsData = action.payload
        })
        builder.addCase(fetchCommentsByPostId.rejected, (state, action) => {
            state.errorMessage = action.payload
        })
    }

})

export default commentReducer.reducer

export const {setCommentId, setUserId, setPostId} = commentReducer.actions
