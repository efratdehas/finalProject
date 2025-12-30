import { useState } from 'react';
import { TodosContext } from '../../context/TodosContext';
import { UserContext } from '../../context/UserContext';
import './TodoItem.css';

const TodoItem = ({ todo, onDelete }) => {
    // שליפת המשתמש הנוכחי והפונקציות לעדכון המשימות מהקונטקסטים
    const { currentUser } = UserContext();
    const { setAllTodos, setDataChanged } = TodosContext();

    // מצב מקומי לניהול עריכה של המשימה
    const [editState, setEditState] = useState({
        isEditing: !todo.id,
        editValue: todo.title || ''
    });

    // פונקציה לשמירת השינויים במשימה
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
                setDataChanged(true);
            }
        } catch (err) {
            console.error("Save failed:", err);
            alert("Somesing went wrong. Please try again later.");
        }
    };

    // פונקציה לביטול העריכה
    const handleCancel = () => {
        if (!todo.id) {
            onDelete(null);
        } else {
            setEditState(prev => ({ ...prev, isEditing: false }));
        }
    };

    // פונקציה לשינוי סטטוס המשימה
    const handleToggleStatus = async () => {
        if (!todo.id) return;

        const updatedTodo = {
            ...todo,
            completed: !todo.completed
        };

        try {
            const response = await fetch(`http://localhost:3000/todos/${todo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTodo)
            });

            if (response.ok) {
                const savedTodo = await response.json();
                setAllTodos(prev => prev.map(t => t.id === savedTodo.id ? savedTodo : t));
                setDataChanged(true);
            }
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Somesing went wrong. Please try again later.");
        }
    };


    return (
        <div className={`todo-item ${editState.isEditing ? 'editing-mode' : ''}`}>
            {/* תוכן המשימה עם אפשרות עריכה */}
            <div className="todo-content">
                {!editState.isEditing && <input type="checkbox" checked={todo.completed} onChange={handleToggleStatus} />}

                <span className="todo-id">#{todo.id}</span>
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

            {/* פעולות המשימה: שמירה, ביטול, עריכה ומחיקה */}
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