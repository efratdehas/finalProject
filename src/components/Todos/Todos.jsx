import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { TodosContext } from '../../context/TodosContext';
import TodoItem from '../TodoItem/TodoItem';
import './Todos.css';

const Todos = () => {
    const { todoId } = useParams();
    const { currentUser } = UserContext();

    const { allTodos, setAllTodos, dataChanged, setDataChanged } = TodosContext();

    const [displayState, setDisplayState] = useState({
        displayedTodos: [],
        sortBy: 'id',
        searchQuery: ''
    });

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(`http://localhost:3000/todos?userId=${currentUser.id}`);
                const data = await response.json();
                setAllTodos(data);

                setDisplayState(prev => ({
                    ...prev,
                    displayedTodos: sortData(data, prev.sortBy)
                }));
            } catch (err) {
                console.error("Failed to fetch todos:", err);
            }
        };
        if (currentUser?.id) fetchTodos();
    }, [currentUser?.id]);

    useEffect(() => {
        handleSearch();
        if (dataChanged) setDataChanged(false);
    }, [dataChanged, allTodos]);

    const sortData = (data, criteria) => {
        return [...data].sort((a, b) => a[criteria] < b[criteria] ? -1 : 1);
    };

    const handleSearch = () => {
        const filtered = allTodos.filter(todo =>
            todo.title.toLowerCase().includes(displayState.searchQuery.toLowerCase())
        );
        setDisplayState(prev => ({
            ...prev,
            displayedTodos: sortData(filtered, prev.sortBy)
        }));
    };

    const handleSortChange = (e) => {
        const newSortBy = e.target.value;
        setDisplayState(prev => {
            const sorted = sortData(prev.displayedTodos, newSortBy);
            return { ...prev, sortBy: newSortBy, displayedTodos: sorted };
        });
    };

    const handleDelete = async (id) => {
        if (!id) {
            setDisplayState(prev => ({
                ...prev,
                displayedTodos: prev.displayedTodos.filter(todo => todo.id !== undefined)
            }));
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedTodos = allTodos.filter(todo => todo.id !== id);
                setAllTodos(updatedTodos);
                setDataChanged(true);
            }
        } catch (err) {
            console.error("Error deleting todo:", err);
        }
    };

    return (
        <div className={'todos-container' + (todoId ? ' disabled-view' : '')}>
            <header className="todos-header">
                <div className="search-bar">
                    <select value={displayState.sortBy} onChange={handleSortChange}>
                        <option value="id">ID</option>
                        <option value="title">Title</option>
                        <option value="completed">Execution</option>
                    </select>

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
                                setDataChanged(true); // עדכון שיציג הכל שוב
                            }}>X</button>
                        )}
                    </div>
                    <button className='search-btn' onClick={handleSearch}>Search</button>
                </div>

                <button
                    className="add-todo-btn"
                    onClick={() => setDisplayState(prev => ({
                        ...prev,
                        displayedTodos: [{}, ...prev.displayedTodos]
                    }))}>
                    Add New Todo
                </button>
            </header>

            <div className="todos-list">
                {displayState.displayedTodos.length > 0 ? (
                    displayState.displayedTodos.map((todo, index) => (
                        <TodoItem
                            key={todo.id || `new-${index}`}
                            todo={todo}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <p className="no-results">No tasks found...</p>
                )}
            </div>
        </div>
    );
};

export default Todos;