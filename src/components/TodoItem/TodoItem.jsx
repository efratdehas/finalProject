import { useState } from 'react';
import { useTodos } from '../../context/TodosContext';
import { UserContext } from '../../context/UserContext';
import { SaveCancelButtons } from '../UI/UI.jsx';
import './TodoItem.css';

const TodoItem = ({ todo, closeNewTodo }) => {
    const { currentUser } = UserContext();
    const { dispatch, deleteTodo, toggleTodoStatus, saveTodo } = useTodos();

    const [editState, setEditState] = useState({
        isEditing: !todo.id,
        editValue: todo.title || ''
    });

    const handleSave = async () => {
        if (!editState.editValue.trim()) return;
        let savedTodo = todo;
        if (!todo.id) {
            delete savedTodo.id;
        }
        await saveTodo({
            ...savedTodo,
            title: editState.editValue,
            userId: currentUser.id
        });

        setEditState(prev => ({ ...prev, isEditing: false }));
        if (closeNewTodo) closeNewTodo();
    };

    const handleCancel = () => {
        if (!todo.id) {
            dispatch({ type: 'DELETE_TODO', id: null });
            if (closeNewTodo) closeNewTodo();
        } else {
            setEditState({
                isEditing: false,
                editValue: todo.title
            });
        }
    };

    const handleRemove = async () => {
        if (!todo.id) {
            dispatch({ type: 'DELETE_TODO', id: null });
        } else {
            await deleteTodo(todo.id);
        }
    };

    return (
        <div className={`todo-item ${editState.isEditing ? 'editing-mode' : ''}`}>
            <div className="todo-content">
                {!editState.isEditing && (
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodoStatus(todo.id)}
                    />
                )}

                <span className="todo-id">#{todo.id}</span>

                {editState.isEditing ? (
                    <input
                        type="text"
                        className="edit-input"
                        value={editState.editValue}
                        onChange={(e) =>
                            setEditState(prev => ({
                                ...prev,
                                editValue: e.target.value
                            }))
                        }
                        autoFocus
                    />
                ) : (
                    <span className="todo-title">{todo.title}</span>
                )}
            </div>

            <div className="todo-actions">
                {editState.isEditing ? (
                    // <>
                    //     <button onClick={handleSave} className="btn-icon">✔</button>
                    //     <button onClick={handleCancel} className="btn-icon">✖</button>
                    // </>
                    <SaveCancelButtons
                        onSave={handleSave}
                        onCancel={handleCancel}
                        width="45px"
                    />
                ) : (
                    <>
                        <button
                            onClick={() =>
                                setEditState(prev => ({ ...prev, isEditing: true }))
                            }
                            className="btn-icon"
                        >
                            ✎
                        </button>
                        <button
                            onClick={handleRemove}
                            className="btn-icon"
                        >
                            🗑️
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TodoItem;