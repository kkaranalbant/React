import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import UserInfo from "./UserInfo";
import {setIsClickedProfileButton} from "../redux/UserPanelReducer";
import './css/UserPanel.css'
import {Link} from 'react-router-dom'

function UserPanel() {
    return (<div className="link-container">
        <Link className="link" to="/user-info">Profile</Link>
        <Link className="link" to="/user-update">Update Profile</Link>
        <Link className="link" to="/user-delete">Delete Profile</Link>
        <Link className="link" to="/user-posts">My Posts</Link>
        <Link className="link" to="/user-complatins">My Complaints</Link>
        <Link className="link" to="/user-comments">My Comments</Link>
        <Link className="link" to="/user-likes">My Likes</Link>
    </div>)
}

export default UserPanel;