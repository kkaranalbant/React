import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {loadPost, setId} from "../redux/post/PostPageReducer";
import {fetchCommentsByPostId} from "../redux/comment/CommentReducer";
import Comment from "../comment/Comment";
import {setPostId} from "../redux/comment/AddCommentReducer";
import CommentAdd from "../comment/CommentAdd";

function PostPage({id}) {
    const {data} = useSelector(store => store.postPageReducer);
    const {postCommentsData} = useSelector(store => store.commentReducer);
    const dispatch = useDispatch();
    dispatch(setPostId(id))
    const fetchAllCommentsForPost = async () => {
        await dispatch(fetchCommentsByPostId(id))
    }
    useEffect(() => {
        dispatch(setPostId(id));
        dispatch(setId(id));
        dispatch(loadPost());
        dispatch(fetchCommentsByPostId(id))
    }, [dispatch, id]);


    if (!data) return null
    return (
        <div>
            <img
                src={`data:image/png;base64,${data.encodedImage}`} // Base64 kullanımı
                alt={data.title}
            />
            <div>
                {data.title}
                {data.creatingTime}
                {data.authorName}
                {data.isEditted}
            </div>
            <div>
                {postCommentsData && postCommentsData.map((comment, index) =>
                    (<Comment key={index} id={comment.id} postId = {id} />
                    ))}
            </div>
            <div>
                <CommentAdd postId={id} handleAddComment={fetchAllCommentsForPost}/>
            </div>
        </div>
    )
        ;
}

export default PostPage;