import { useState, useEffect, useCallback } from 'react';
import { UserContext } from './../../context/UserContext';
import { PostsContext } from '../../context/PostsContext';
import './Posts.css';

const Posts = () => {
    // שליפת הנתונים הנצרכים מהקונטקסט
    const { currentUser } = UserContext();
    const { othersPosts, setOthersPosts, myPosts, setMyPosts, dataChanged, setDataChanged } = PostsContext();

    // מצב מקומי לניהול תצוגת הפוסטים, מיון, חיפוש ומצב צפייה
    const [displayState, setDisplayState] = useState({
        displayedPosts: [],
        sortBy: 'id',
        searchQuery: '',
        viewMode: 'all'
    });

    // פונקציה למיון הנתונים לפי קריטריון מסוים
    const sortData = useCallback((data, criteria) => {
        if (!data) return [];
        return [...data].sort((a, b) => {
            if (criteria === 'id') return parseInt(a.id) - parseInt(b.id);
            return String(a[criteria]).localeCompare(String(b[criteria]), undefined, { numeric: true });
        });
    }, []);

    // פונקציה לקבלת מקור הנתונים בהתאם למצב הצפייה
    const getSourceByMode = useCallback((currentMode, mPosts, oPosts) => {
        let src = [];
        if (currentMode === 'all') src = [...mPosts, ...oPosts];
        else if (currentMode === 'mine') src = mPosts;
        else src = oPosts;
        return src;
    }, []);

    // פונקציה לטיפול בחיפוש ועדכון התצוגה
    const handleSearch = (newMode) => {
        const mode = newMode || displayState.viewMode;
        const source = getSourceByMode(mode, myPosts, othersPosts);
        const filtered = source.filter(post =>
            (post.title || "").toLowerCase().includes(displayState.searchQuery.toLowerCase())
        );
        if (newMode)
            setDisplayState(prev => ({
                ...prev,
                displayedPosts: sortData(filtered, prev.sortBy),
                viewMode: newMode
            }));
        else
            setDisplayState(prev => ({
                ...prev,
                displayedPosts: sortData(filtered, prev.sortBy)
            }));
    };

    // שינוי סוג המיון 
    const handleSortChange = (e) => {
        const newSortBy = e.target.value;
        setDisplayState(prev => ({
            ...prev,
            sortBy: newSortBy,
            displayedPosts: sortData(prev.displayedPosts, newSortBy)
        }));
    };

    // שינוי מצב הצפייה
    const handleModeChange = (newMode) => {
        handleSearch(newMode);
    };

    // שליפת הפוסטים מהשרת בעת טעינת הקומפוננטה או שינוי המשתמש הנוכחי
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('http://localhost:3000/posts');
                const data = await res.json();

                const mine = data.filter(p => p.userId == currentUser.id);
                const others = data.filter(p => p.userId != currentUser.id);

                setMyPosts(mine);
                setOthersPosts(others);

                setDisplayState(prev => ({
                    ...prev,
                    displayedPosts: sortData(data, prev.sortBy)
                }));
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                alert("Something went wrong. Please try again later.");
            }
        };
        if (currentUser?.id) fetchPosts();
    }, [currentUser?.id, setMyPosts, setOthersPosts, sortData]);

    // עדכון התצוגה כאשר יש שינוי בנתונים הגלובליים
    useEffect(() => {
        if (dataChanged) {
            handleSearch();
            setDataChanged(false);
        }
    }, [dataChanged, setDataChanged]);

    return (
        <div className="posts-container">
            {/* כותרת עם כלי חיפוש, מיון ובחירת מצב צפייה */}
            <header className="posts-header">
                <div className="search-bar">
                    <select value={displayState.sortBy} onChange={handleSortChange}>
                        <option value="id">ID</option>
                        <option value="title">Title</option>
                    </select>

                    {/* שדה חיפוש עם כפתור ניקוי */}
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={displayState.searchQuery}
                            onChange={(e) => setDisplayState(prev => ({ ...prev, searchQuery: e.target.value }))}
                        />
                        {displayState.searchQuery && (
                            <button className="clear-btn" onClick={() => {
                                setDisplayState(prev => ({ ...prev, searchQuery: '' }));
                                setDataChanged(true);
                            }}>X</button>
                        )}
                    </div>
                    <button className='search-btn' onClick={handleSearch}>Search</button>
                </div>

                {/* כפתורי בחירת מצב צפייה */}
                <div className="view-toggle-btns">
                    <button className={displayState.viewMode === 'all' ? 'active' : ''} onClick={() => handleModeChange('all')}>All</button>
                    <button className={displayState.viewMode === 'mine' ? 'active' : ''} onClick={() => handleModeChange('mine')}>Mine</button>
                    <button className={displayState.viewMode === 'others' ? 'active' : ''} onClick={() => handleModeChange('others')}>Others</button>
                </div>

                <button className="add-todo-btn" onClick={() => { }}>Add New Post</button>
            </header>

            {/* רשימת הפוסטים */}
            <div className="posts-list">
                {displayState.displayedPosts.map(post => (
                    <div key={post.id} className="post-item">
                        <span className="post-id">#{post.id}</span>
                        <div className="post-info">
                            <span className="post-title">{post.title}</span>
                        </div>
                        <span className="post-author">{post.userId == currentUser.id ? "(Me)" : `(User ${post.userId})`}</span>
                    </div>
                ))}
                {displayState.displayedPosts.length === 0 && <p className="no-results">No posts found...</p>}
            </div>
        </div>
    );
};

export default Posts;