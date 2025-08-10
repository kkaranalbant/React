import {configureStore, combineReducers} from "@reduxjs/toolkit";
import loginReducer from "./login/LoginPanelReducer";
import userInfoReducer from "./user/UserInfoReducer";
import userPanelReducer from "./user/UserPanelReducer";
import userUpdateReducer from "./user/UserUpdateReducer";
import userDeleteReducer from "./user/UserDeleteReducer";
import mainPostPanelReducer from "./post/MainPostPanelReducer";
import postPageReducer from "./post/PostPageReducer";
import commentReducer from "./comment/CommentReducer";
import addCommentReducer from "./comment/AddCommentReducer";
import commentLikeReducer from "./comment/like/CommentLikeReducer";

const rootReducer = combineReducers({
    userPanelReducer: userPanelReducer,
    loginReducer: loginReducer,
    userInfoReducer: userInfoReducer,
    userUpdateReducer: userUpdateReducer,
    userDeleteReducer: userDeleteReducer,
    mainPostPanelReducer: mainPostPanelReducer,
    postPageReducer: postPageReducer,
    commentReducer: commentReducer,
    addCommentReducer: addCommentReducer,
    commentLikeReducer: commentLikeReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});