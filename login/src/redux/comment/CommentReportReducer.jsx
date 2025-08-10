import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {initialStates as response} from "../user/UserInfoReducer";

const reportUrl = "http://localhost:8080/v1/comment-report/report"


export const reportComment = createAsyncThunk("CommentReportReducer/reportComment",
    async (id , explanation, {rejectWithValue}) => {
        try {
            const payload = {
                commentId : id ,
                explanation : explanation,
            }
            const response = await axios().post(reportUrl , payload , {
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