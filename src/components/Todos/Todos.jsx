import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { useTodos } from '../../context/TodosContext';
import useFilterAndSort from '../../context/useFilterAndSort';
import TodoItem from '../TodoItem/TodoItem';
import { AddButton, FilterBar } from '../UI/UI.jsx';
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
                <FilterBar
                    criteria={['title', 'id', 'completed']}
                    search={search}
                    setSearch={setSearch}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                <AddButton type="Todo" onClick={handleNewTodo} />
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