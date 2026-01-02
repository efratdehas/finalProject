import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { PostsContext } from '../../context/PostsContext';
import './PostDetails.css';

const PostDetails = () => {
    const navigate = useNavigate();
    const { postID } = useParams();
    const { currentUser } = UserContext();
    const { myPosts, othersPosts, setMyPosts, setDataChanged } = PostsContext();

    const isNewPost = postID === 'new-post';

    // ריכוז כל הסטייטים לאובייקט אחד
    const [postState, setPostState] = useState({
        post: null,
        isEditing: isNewPost,
        editValues: { title: '', body: '' },
        loading: !isNewPost
    });

    useEffect(() => {
        if (isNewPost) {
            setPostState(prev => ({
                ...prev,
                post: { userId: currentUser.id, title: '', body: '' },
                editValues: { title: '', body: '' },
                isEditing: true,
                loading: false
            }));
        } else {
            const fetchPost = async () => {
                try {
                    // ניסיון למצוא בקונטקסט הקיים
                    const foundPost = [...myPosts, ...othersPosts].find(p => String(p.id) === String(postID));

                    if (foundPost) {
                        setPostState(prev => ({
                            ...prev,
                            post: foundPost,
                            editValues: { title: foundPost.title, body: foundPost.body },
                            loading: false
                        }));
                    } else {
                        // שליפה מהשרת אם לא נמצא
                        const res = await fetch(`http://localhost:3000/posts/${postID}`);
                        if (!res.ok) throw new Error();
                        const data = await res.json();
                        setPostState(prev => ({
                            ...prev,
                            post: data,
                            editValues: { title: data.title, body: data.body },
                            loading: false
                        }));
                    }
                } catch (err) {
                    navigate('..', { relative: 'path', replace: true });
                }
            };
            fetchPost();
        }
    }, [postID, isNewPost, currentUser.id, navigate, myPosts, othersPosts]);

    const handleSave = async () => {
        const url = isNewPost ? `http://localhost:3000/posts` : `http://localhost:3000/posts/${postID}`;
        const method = isNewPost ? 'POST' : 'PUT';
        const bodyData = isNewPost
            ? { userId: currentUser.id, ...postState.editValues }
            : { ...postState.post, ...postState.editValues };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                const savedPost = await response.json();
                // עדכון הקונטקסט
                if (isNewPost) {
                    setMyPosts(prev => [savedPost, ...prev]);
                } else {
                    setMyPosts(prev => prev.map(p => p.id === savedPost.id ? savedPost : p));
                }

                setDataChanged(true);

                // עדכון הסטייט המקומי
                setPostState(prev => ({
                    ...prev,
                    post: savedPost,
                    isEditing: false
                }));

                if (isNewPost) navigate('..', { relative: 'path' });
            }
        } catch (err) {
            alert("something went wrong, please try again.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const response = await fetch(`http://localhost:3000/posts/${postID}`, { method: 'DELETE' });
            if (response.ok) {
                setMyPosts(prev => prev.filter(p => p.id !== postState.post.id));
                setDataChanged(true);
                navigate(`/users/${currentUser.id}/posts`, { replace: true });
            }
        } catch (err) {
            alert("something went wrong, please try again.");
        }
    };

    if (postState.loading) return <div className="loading">Loading...</div>;

    const isOwner = postState.post?.userId == currentUser.id;

    return (
        <div className="post-details-container">
            <div className="post-btns">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

                {isOwner && !postState.isEditing && (
                    <div>
                        <button className="edit-btn" onClick={() => setPostState(prev => ({ ...prev, isEditing: true }))}>✎</button>
                        <button className="delete-btn-detail" onClick={handleDelete}>🗑️</button>
                    </div>
                )}

                {postState.isEditing && (
                    <div className="edit-actions">
                        <button className="save-btn" onClick={handleSave}>Confirm</button>
                        <button className="cancel-btn" onClick={() => {
                            if (isNewPost) navigate(-1);
                            else setPostState(prev => ({
                                ...prev,
                                isEditing: false,
                                editValues: { title: prev.post.title, body: prev.post.body }
                            }));
                        }}>Cancel</button>
                    </div>
                )}
            </div>

            <div className="post-card">
                <header className="post-details-header">
                    {postState.isEditing ? (
                        <textarea
                            className="edit-title-input"
                            value={postState.editValues.title}
                            onChange={(e) => setPostState(prev => ({
                                ...prev,
                                editValues: { ...prev.editValues, title: e.target.value }
                            }))}
                        />
                    ) : (
                        <h1>{postState.post?.title}</h1>
                    )}
                </header>
                <hr />
                <div className="post-body-section">
                    {postState.isEditing ? (
                        <textarea
                            className="edit-body-textarea"
                            value={postState.editValues.body}
                            onChange={(e) => setPostState(prev => ({
                                ...prev,
                                editValues: { ...prev.editValues, body: e.target.value }
                            }))}
                        />
                    ) : (
                        <p>{postState.post?.body}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetails;