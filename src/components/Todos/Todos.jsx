import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { useTodos } from '../../context/TodosContext';
import useFilterAndSort from '../../context/useFilterAndSort';
import TodoItem from '../TodoItem/TodoItem';
import './Todos.css';

const Todos = () => {
    const { id, todoId } = useParams();
    const { currentUser } = UserContext();

    const {
        todos,
        fetchTodos,
    } = useTodos();

    const {
        search,
        setSearch,
        sortBy,
        setSortBy,
        sortedData
    } = useFilterAndSort(todos, ['title', 'id', 'completed']);

    const [newTodo, setNewTodo] = useState(false);

    useEffect(() => {
        if (String(currentUser?.id) === String(id)) {
            fetchTodos();
        }
    }, [currentUser?.id, id]);

    const handleNewTodo = () => {
        if (!newTodo)
            setNewTodo(true);
    };

    const closeNewTodo = () => setNewTodo(false);

    return (
        <div className={'todos-container' + (todoId ? ' disabled-view' : '')}>
            <header className="todos-header">
                <div className="search-bar">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="id">ID</option>
                        <option value="title">Title</option>
                        <option value="completed">Execution</option>
                    </select>

                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder={`Search by ${search.field}...`}
                            value={search.query}
                            onChange={(e) => setSearch(prev => ({ ...prev, query: e.target.value }))}
                        />
                        {search.query && (
                            <button
                                className="clear-btn"
                                onClick={() => setSearch(prev => ({ ...prev, query: '' }))}
                            >X</button>
                        )}
                    </div>

                    <button
                        className="swich-btn"
                        onClick={() => setSearch(prev => ({ ...prev, fieldNumber: (prev.fieldNumber + 1) % 3 }))}
                    >🔄</button>
                </div>

                <button className="add-todo-btn" onClick={handleNewTodo}>
                    Add New Todo
                </button>
            </header>

            <div className="todos-list">
                {newTodo ? <TodoItem
                    key={`new-task`}
                    todo={{ id: null, title: '' }}
                    closeNewTodo={closeNewTodo}
                /> : null
                }
                {sortedData.length > 0 ? (
                    sortedData.map((todo, index) => (
                        <TodoItem
                            key={todo.id || `new-${index}`}
                            todo={todo}
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