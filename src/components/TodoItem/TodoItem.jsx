import { useState } from 'react';
import { TodosContext } from '../../context/TodosContext';
import { UserContext } from '../../context/UserContext';
import './TodoItem.css';

const TodoItem = ({ todo, onDelete }) => {
    const { currentUser } = UserContext();
    const { setAllTodos, setDataChanged } = TodosContext();

    const [editState, setEditState] = useState({
        isEditing: !todo.id,
        editValue: todo.title || ''
    });

    const handleSave = async () => {
        if (!editState.editValue.trim()) return;

        const isNew = todo.id ? false : true;
        const url = isNew ? `http://localhost:3000/todos` : `http://localhost:3000/todos/${todo.id}`;
        const method = isNew ? 'POST' : 'PUT';

        const todoData = {
            ...todo,
            title: editState.editValue,
            userId: currentUser.id,
            completed: todo.completed || false
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todoData)
            });

            if (response.ok) {
                const savedTodo = await response.json();

                if (isNew) {
                    setAllTodos(prev => [savedTodo, ...prev]);
                } else {
                    setAllTodos(prev => prev.map(t => t.id === savedTodo.id ? savedTodo : t));
                }
                setEditState(prev => ({ ...prev, isEditing: false }));
                setDataChanged(prev => !prev);
            }
        } catch (err) {
            console.error("Save failed:", err);
        }
    };


    const handleCancel = () => {
        if (!todo.id) {
            onDelete(null);
        } else {
            setEditState(prev => ({ ...prev, isEditing: false }));
        }
    };

    return (
        <div className={`todo-item ${editState.isEditing ? 'editing-mode' : ''}`}>
            <div className="todo-content">
                {!editState.isEditing && <input type="checkbox" checked={todo.completed} readOnly />}

                {editState.isEditing ? (
                    <input
                        type="text"
                        className="edit-input"
                        value={editState.editValue}
                        onChange={(e) => setEditState(prev => ({ ...prev, editValue: e.target.value }))}
                        autoFocus
                    />
                ) : (
                    <span className="todo-title">{todo.title}</span>
                )}
            </div>

            <div className="todo-actions">
                {editState.isEditing ? (
                    <>
                        <button onClick={handleSave} className="btn-icon save-btn" title="Save">✔</button>
                        <button onClick={handleCancel} className="btn-icon cancel-btn" title="Cancel">✖</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setEditState(prev => ({ ...prev, isEditing: true }))} className="btn-icon">✎</button>
                        <button onClick={() => onDelete(todo.id)} className="btn-icon">🗑️</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TodoItem;