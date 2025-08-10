import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios"
import {userPanelReducer} from "./UserPanelReducer";

const deleteUrl = "http://localhost:8080/v1/user/delete"

const initialStates = {
    ok: null,
    error: null,
    pending: null,
    confirmingMessage: "DELETE MY ACCOUNT" ,
    userMessage: null
}

export const deleteUser = createAsyncThunk("UserDeleteReducer/deleteUser", async (_, {getState , rejectWithValue}) => {
    try {
        const state = getState().userDeleteReducer ;
        if (state.userMessage !== state.confirmingMessage) {rejectWithValue("Invalid Input")}
        const response = await axios.delete(deleteUrl, {
            allowCredentials: true,
        })
        if (response.status !== 200) {
            return rejectWithValue(response.data.message)
        }
        return await response.data
    } catch (error) {
        rejectWithValue(error.message)
    }

})

const userDeleteReducer = createSlice({
    name: "userDeleteReducer",
    initialState: initialStates,
    reducers: {
        setUserMessage: (state, action) => {
            state.userMessage = action.payload
        }
    },
    extraReducers: (builder) =>
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.ok = true
            state.error = false
            state.pending = false
        })
            .addCase(deleteUser.pending, (state, action) => {
                state.ok = false
                state.error = false
                state.pending = true
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.ok = false
                state.error = true
                state.pending = false
            })
})

export default userDeleteReducer.reducer
export const {setUserMessage} = userDeleteReducer.actions