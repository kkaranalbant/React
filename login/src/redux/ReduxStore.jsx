import {configureStore, combineReducers} from "@reduxjs/toolkit";
import loginReducer from "./LoginPanelReducer";
import userInfoReducer from "./UserInfoReducer";
import userPanelReducer from "./UserPanelReducer";
import userUpdateReducer from "./UserUpdateReducer";
import userDeleteReducer from "./UserDeleteReducer";

const rootReducer = combineReducers({
    userPanelReducer: userPanelReducer,
    loginReducer: loginReducer,
    userInfoReducer: userInfoReducer,
    userUpdateReducer: userUpdateReducer,
    userDeleteReducer: userDeleteReducer
});

export const store = configureStore({
    reducer: rootReducer,
});