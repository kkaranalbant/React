import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export const initialStates = {
    data: null,
    error: null,
    loading: null,
}


export const fetchUserData = createAsyncThunk("UserInfoReducer/fetchUserData",
    async (_, {rejectWithValue}) => {
        try {
            const {data} = await axios.get("http://localhost:8080/v1/user/get" , {
                withCredentials: true
            });
            console.log("asd")
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const userInfoReducer = createSlice({
    name: "UserInfoReducer",
    initialState: initialStates,
    extraReducers: (builder) => builder
        .addCase(fetchUserData.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        })
        .addCase(fetchUserData.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
})


export default userInfoReducer.reducer;