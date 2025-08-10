import {combineReducers, configureStore} from "@reduxjs/toolkit";
import sendArticleReducer from "./article/SendArticleReducer";
import getArticleReducer from "./article/GetArticleReducer";


const rootReducer = combineReducers({
    sendArticleReducer : sendArticleReducer,
    getArticleReducer : getArticleReducer ,
});

export const store = configureStore({
    reducer: rootReducer,
});