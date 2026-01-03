import { createContext, useContext, useReducer, useCallback } from 'react';
import { UserContext } from './UserContext';
import { useFetch } from './useFetch';

const TodosContext = createContext();

const initialTodosState = {
    todos: [],
    loading: false,
    error: null
};

function todosReducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };

        case 'FETCH_SUCCESS':
            return { todos: action.todos, loading: false, error: null };

        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.error };

        case 'ADD_TODO':
            return { ...state, todos: [action.todo, ...state.todos] };

        case 'UPDATE_TODO':
            return {
                ...state,
                todos: state.todos.map(t =>
                    t.id === action.todo.id ? action.todo : t
                )
            };

        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(t => t.id !== action.id && t.id !== null)
            };

        default:
            return state;
    }
}

export const TodosProvider = ({ children }) => {
    const { currentUser } = UserContext();
    const { sendRequest } = useFetch();

    const [todosState, dispatch] = useReducer(
        todosReducer,
        initialTodosState
    );

    const fetchTodos = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });

        try {
            const data = await sendRequest(
                `http://localhost:3000/todos?userId=${currentUser.id}`
            );

            dispatch({ type: 'FETCH_SUCCESS', todos: data });
        } catch (err) {
            dispatch({ type: 'FETCH_ERROR', error: err.message });
        }
    }, [sendRequest, currentUser.id]);

    const saveTodo = async (todo) => {
        const isNew = !todo.id;
        const url = isNew ? 'http://localhost:3000/todos' : `http://localhost:3000/todos/${todo.id}`;
        const method = isNew ? 'POST' : 'PUT';

        const saved = await sendRequest(url, method, todo);

        dispatch({
            type: isNew ? 'ADD_TODO' : 'UPDATE_TODO',
            todo: saved
        });
    };

    const deleteTodo = async (id) => {
        if (!id) {
            dispatch({ type: 'DELETE_TODO', id: null });
            return;
        }
        await sendRequest(`http://localhost:3000/todos/${id}`, 'DELETE');
        dispatch({ type: 'DELETE_TODO', id });
    };

    const toggleTodoStatus = async (id) => {
        const todo = todosState.todos.find(t => t.id === id);
        if (!todo) return;

        const updated = { ...todo, completed: !todo.completed };

        const saved = await sendRequest(
            `http://localhost:3000/todos/${id}`,
            'PUT',
            updated
        );

        dispatch({ type: 'UPDATE_TODO', todo: saved });
    };

    return (
        <TodosContext.Provider value={{
            todos: todosState.todos,
            isLoading: todosState.loading,
            error: todosState.error,
            dispatch,
            fetchTodos,
            saveTodo,
            deleteTodo,
            toggleTodoStatus
        }}>
            {children}
        </TodosContext.Provider>
    );
}

export const useTodos = () => useContext(TodosContext);