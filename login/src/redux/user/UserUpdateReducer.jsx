import React from 'react';
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:8080/v1/user/update";

const initialStates = {
    username: null,
    password: null,
    birthDate: null,
    email: null,
    image: null,
    name: null,
    lastname: null,
    ok: null
}

export const updateUser = createAsyncThunk("createUpdateUser/updateUser ", async (_, {getState, rejectWithValue}) => {
    const state = getState().userUpdateReducer; // Redux state'ine eriş

    if (!state.username  || !state.birthDate || !state.email || !state.name || !state.lastname) {
        return rejectWithValue("Tüm alanlar zorunludur.");
    }
    const payload = {
        username: state.username,
        password: state.password,
        birthDate: state.birthDate,
        email: state.email,
        image: state.image,
        name: state.name,
        lastname: state.lastname,
    };
    const response = await axios.post(URL, payload, {
        header : {
            contentType: "multipart/form-data",
        },
        withCredentials: true,
    });
    try {
        if (response.status !== 200) {
            rejectWithValue(response.statusText);
        }
        return response.data
    } catch (error) {
        rejectWithValue(error.message);
    }
})

export const userUpdateReducer = createSlice({
    name: "userUpdateReducer",
    initialState: initialStates,
    reducers: {
        updateUsername: (state, action) => {
            state.username = action.payload;
        },
        updatePassword: (state, action) => {
            state.password = action.payload;
        },
        updateEmail: (state, action) => {
            state.email = action.payload;
        },
        updateBirthDate: (state, action) => {
            state.birthDate = action.payload;
        },
        updateImage: (state, action) => {
            state.image = action.payload;
        },
        updateName: (state, action) => {
            state.name = action.payload;
        },
        updateLastName: (state, action) => {
            state.lastname = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.ok = true;
        })
    }
})

export default userUpdateReducer.reducer;
export const {
    updateUsername, updatePassword,
    updateBirthDate, updateEmail,
    updateImage, updateLastName,
    updateName
} = userUpdateReducer.actions