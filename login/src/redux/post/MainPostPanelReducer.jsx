import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";


const initialStates = {
    loading: null,
    error: null,
    success: null,
    data: null,
}

export const postFetchingUrl = "http://localhost:8080/v1/post/get-all-main"

export const fetchPosts = createAsyncThunk("MainPostPanelReducer/fetchPosts", async (_, {
    getState,
    rejectWithValue
}) => {
    try {
        const response = await axios.get(postFetchingUrl , {
            withCredentials: true
        });
        if (response.status !== 200) {
            rejectWithValue(response.data)
        }
        return response.data
    } catch (error) {
        rejectWithValue(error.message)
    }
})

const mainPostPanelReducer = createSlice({
    name: "mainPostPanelReducer",
    initialState: initialStates,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.loading = false
            state.error = true
            state.success = false
        })
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.loading = false
            state.error = false
            state.success = true
            state.data = action.payload;
        })
        builder.addCase(fetchPosts.pending, (state, action) => {
            state.loading = true
            state.error = false
            state.success = false
        })
    }
})

export default mainPostPanelReducer.reducer

export const {setData} = mainPostPanelReducer.actions