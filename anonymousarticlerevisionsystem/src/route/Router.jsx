import React from 'react';
import {Route, Routes} from "react-router-dom";
import SendArticle from "../article/SendArticle";
import AllArticlesForDirector from "../article/AllArticlesForDirector";
import AllArticlesForReferee from "../article/AllArticlesForReferee";
import GetArticleForClient from "../article/GetArticleForClient";
import SendNotificationToEditor from "../notification/SendNotificationToEditor";
import GetAllNotifications from "../notification/GetAllNotifications";

function Router(props) {
    return (
        <Routes>
            <Route path="/query" element={<GetArticleForClient/>}/>
            <Route path="/all-articles" element={<AllArticlesForDirector/>}/>
            <Route path="/all-articles-reviewer" element={<AllArticlesForReferee/>}/>
            <Route path="/send-article" element={<SendArticle/>}/>
            <Route path="/send-message-to-editor" element = {<SendNotificationToEditor/>}/>
            <Route path="/get-all-messages" element = {<GetAllNotifications/>}/>
        </Routes>

    )
        ;
}

export default Router;