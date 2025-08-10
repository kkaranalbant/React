import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const articleSendingUrl = "https://localhost:8080/v1/article/send-to-director"


const initialStates = {
    email: null,
    data: null,
}


export const sendData = createAsyncThunk("SendArticleReducer/sendData", async (_, {getState, rejectWithValue}) => {
    const state = getState().sendArticleReducer;
    try {
        const formData = new FormData();
        formData.append("email", state.email);
        formData.append("data", new Blob([Uint8Array.from(atob(state.data), c => c.charCodeAt(0))], {type: "application/octet-stream"}));        const response = await axios.post(articleSendingUrl, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        if (response.status !== 200) {
            rejectWithValue(response.data);
        }
        return response.data
    } catch (error) {
        return rejectWithValue(error.message);
    }
})


const sendArticleReducer = createSlice({
    name: "sendArticleReducer",
    initialState: initialStates,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setData: (state, action) => {
            state.data = action.payload;
        }
    },

})

export default sendArticleReducer.reducer;

export const {setEmail, setData} = sendArticleReducer.actions;