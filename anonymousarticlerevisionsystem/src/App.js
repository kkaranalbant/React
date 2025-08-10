import React from 'react';
import {Route, Routes, Link} from 'react-router-dom';
import SendArticle from './article/SendArticle';
import GetArticleForClient from './article/GetArticleForClient';
import AllArticlesForDirector from './article/AllArticlesForDirector';
import AllArticlesForReferee from './article/AllArticlesForReferee';
import AllArticlesWithReviewer from './article/AllArticlesWithReviewer';
import "./App.css";
import SendNotificationToEditor from "./notification/SendNotificationToEditor";
import GetAllNotifications from "./notification/GetAllNotifications";

function App() {
    return (
        <>
            <div className="App">
                <Link to="/query">Query Article Status</Link>
                <Link to="/all-articles">All Articles For Director</Link>
                <Link to="/all-articles-reviewer">All Articles For Reviewer</Link>
                <Link to="/send-article">Send Article</Link>
                <Link to="/all-articles-with-reviewer">All Articles With Reviewer</Link>
                <Link to="/get-all-messages">Get All Messages</Link>
                <Link to="/send-message-to-editor">Send Message To Editor</Link>
            </div>
            <div className="RoutesContainer">
                <Routes>
                    <Route path="/query" element={<GetArticleForClient/>}/>
                    <Route path="/all-articles" element={<AllArticlesForDirector/>}/>
                    <Route path="/all-articles-reviewer" element={<AllArticlesForReferee/>}/>
                    <Route path="/send-article" element={<SendArticle/>}/>
                    <Route path="/all-articles-with-reviewer" element={<AllArticlesWithReviewer/>}/>
                    <Route path="/send-message-to-editor" element = {<SendNotificationToEditor/>}/>
                    <Route path="/get-all-messages" element = {<GetAllNotifications/>}/>
                </Routes>
            </div>
        </>
    );
}

export default App;