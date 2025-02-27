import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";


export const initialStates = {
    isClickedProfileButton: false
}

export const userPanelReducer = createSlice({
    name: "UserPanelReducer",
    initialState: initialStates,
    reducers: {
        setIsClickedProfileButton: (state, action) => {
            state.isClickedProfileButton = action.payload;
        }
    },
})

export default userPanelReducer.reducer;

export const {setIsClickedProfileButton} = userPanelReducer.actions;