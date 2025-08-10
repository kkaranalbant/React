import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchPosts, setData} from "../redux/post/MainPostPanelReducer";
import './css/MainPostPanel.css'
import {useNavigate } from "react-router-dom";

function MainPostPanel(props) {
    const {loading, error, success, data} = useSelector(store => store.mainPostPanelReducer)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);
    const navigate = useNavigate();
    const handleClick = async (id) => {
        navigate("/post/get/" + id);
    }

    if (!data) return null
    return (
        <div>
            <h1>POSTS</h1>
            <div>
                <ul className="post-container">
                    {data.map((post) => (
                        <li key={post.id}>
                            <h3 onClick={() => {
                                handleClick(post.id)
                            }}>{post.title}</h3>
                            <img
                                src={`data:image/png;base64,${post.encodedImage}`} // Base64 kullanımı
                                alt={post.title}
                                onClick={() => handleClick(post.id)}
                                style={{width: "200px", height: "auto", cursor: "pointer", borderRadius: "10px"}}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MainPostPanel;