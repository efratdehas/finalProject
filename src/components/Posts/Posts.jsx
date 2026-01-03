import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { usePosts } from '../../context/PostsContext';
import useFilterAndSort from '../../context/useFilterAndSort';
import { AddButton, FilterBar } from '../UI/UI.jsx';
import './Posts.css';

const Posts = () => {
    const navigate = useNavigate();
    const { currentUser } = UserContext();
    const { posts, fetchPosts, isLoading } = usePosts();
    const [viewMode, setViewMode] = useState('all');

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // סינון ראשוני לפי מצב הצפייה (שלי/של כולם)
    const filteredByMode = useMemo(() => {
        if (viewMode === 'mine') return posts.filter(p => p.userId == currentUser.id);
        if (viewMode === 'others') return posts.filter(p => p.userId != currentUser.id);
        return posts;
    }, [posts, viewMode, currentUser.id]);

    const {
        search,
        setSearch,
        sortBy,
        setSortBy,
        sortedData
    } = useFilterAndSort(filteredByMode, ['title', 'id']);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="posts-container">
            <header className="posts-header">
                <FilterBar
                    criteria={['title', 'id']}
                    search={search} setSearch={setSearch}
                    sortBy={sortBy} setSortBy={setSortBy}
                />
                
                <div className="view-toggle-btns">
                    <button className={viewMode === 'all' ? 'active' : ''} onClick={() => setViewMode('all')}>All</button>
                    <button className={viewMode === 'mine' ? 'active' : ''} onClick={() => setViewMode('mine')}>Mine</button>
                    <button className={viewMode === 'others' ? 'active' : ''} onClick={() => setViewMode('others')}>Others</button>
                </div>

                <AddButton type="Post" onClick={() => navigate('new-post')} />
            </header>

            <div className="posts-list">
                {sortedData.map(post => (
                    <div key={post.id} className="post-item" onDoubleClick={() => navigate(`./${post.id}`)}>
                        <span className="post-id">#{post.id}</span>
                        <span className="post-title">{post.title}</span>
                        <span className="post-author">{post.userId == currentUser.id ? "(Me)" : ''}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Posts;