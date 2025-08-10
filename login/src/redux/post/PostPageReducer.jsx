import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import postPage from "../../post/PostPage";


const initialStates = {
    data: null,
    id: null
}

const url = "http://localhost:8080/v1/post/get?id="

export const loadPost = createAsyncThunk("PostPageReducer/loadPost", async (_, {getState, rejectWithValue}) => {
    try {
        const state = await getState();
        const response = await axios.get(url + state.postPageReducer.id, {
            withCredentials: true
        })
        if (response.status !== 200) {
            rejectWithValue(response.data);
        }
        return response.data
    } catch (error) {
        rejectWithValue(error.message)
    }
})

const postPageReducer = createSlice({
    name: "postPageReducer",
    initialState: initialStates,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadPost.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    }
})

export default postPageReducer.reducer

export const {setId} = postPageReducer.actions;