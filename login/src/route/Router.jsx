import React from 'react';
import {Route, Routes, useParams} from "react-router-dom";
import Login from "../login/Login";
import UserPanel from "../user-panel/UserPanel";
import UserInfo from "../user-panel/UserInfo";
import UserUpdate from "../user-panel/UserUpdate";
import UserDelete from "../user-panel/UserDelete";
import PostPage from "../post/PostPage";

const PostWrapper = () => {
    const {id} = useParams();
    return <PostPage id={id}/>;
};


function Router(props) {
    return (
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/main-user' element={<UserPanel/>}/>
            <Route path="/user-info" element={<UserInfo/>}/>
            <Route path="/user-update" element={<UserUpdate/>}/>
            <Route path="/user-delete" element={<UserDelete/>}/>
            <Route path="/post/get/:id" element={<PostWrapper/>}/>
        </Routes>
    );
}

export default Router;