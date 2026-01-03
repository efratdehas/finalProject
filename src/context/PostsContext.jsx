import { createContext, useContext, useReducer, useCallback } from 'react';
import { useFetch } from './useFetch';

const PostsContext = createContext();

const initialPostsState = {
    posts: [],
    loading: false,
    error: null
};

function postsReducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true };

        case 'FETCH_SUCCESS':
            return { posts: action.posts, loading: false, error: null };

        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.error };

        case 'ADD_POST':
            return { ...state, posts: [action.post, ...state.posts] };

        case 'UPDATE_POST':
            return {
                ...state,
                posts: state.posts.map(p => p.id === action.post.id ? action.post : p)
            };

        case 'DELETE_POST':
            return {
                ...state,
                posts: state.posts.filter(p => p.id !== action.id)
            };

        default:
            return state;
    }
}

export const PostsProvider = ({ children }) => {
    const { sendRequest } = useFetch();
    const [postsState, dispatch] = useReducer(
        postsReducer,
        initialPostsState
    );

    const fetchPosts = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });

        try {
            const data = await sendRequest(`http://localhost:3000/posts`);
            dispatch({ type: 'FETCH_SUCCESS', posts: data });
        } catch (err) {
            dispatch({ type: 'FETCH_ERROR', error: err.message });
        }
    }, [sendRequest]);

    const savePost = async (post, userId) => {
        const isNew = !post.id;
        const url = isNew ? `http://localhost:3000/posts` : `http://localhost:3000/posts/${post.id}`;
        const method = isNew ? 'POST' : 'PUT';

        const saved = await sendRequest(url, method, { ...post, userId });

        dispatch({
            type: isNew ? 'ADD_POST' : 'UPDATE_POST',
            post: saved
        });

        return saved;
    };

    const deletePost = async (id) => {
        await sendRequest(`http://localhost:3000/posts/${id}`, 'DELETE');
        dispatch({ type: 'DELETE_POST', id });
    };

    return (
        <PostsContext.Provider value={{
            posts: postsState.posts,
            isLoading: postsState.loading,
            fetchPosts,
            savePost,
            deletePost
        }}>
            {children}
        </PostsContext.Provider>
    );
};

export const usePosts = () => useContext(PostsContext);