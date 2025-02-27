import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const initialState = {
    isLoggedIn: null,
    username: null,
    password: null,
    waiting: null,
    data: null,
};

export const login = createAsyncThunk(
    "LoginPanelReducer/login",
    async ({username, password}, {rejectWithValue}) => {
        try {
            const payload = {username, password};
            const response = await axios.post("http://localhost:8080/login", payload , {
                withCredentials: true
            });
            if (response.status !== 200) {
                return rejectWithValue(response.data);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const loginReducer = createSlice({
    name: "loginReducer",
    initialState: initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoggedIn = false;
                state.waiting = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.waiting = false;
                state.data = action.payload;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.data = action.payload;
                state.waiting = false;
            });
    },
});

export default loginReducer.reducer;
export const {setUsername, setPassword} = loginReducer.actions;