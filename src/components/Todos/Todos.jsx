import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { TodosContext } from '../../context/TodosContext';
import TodoItem from '../TodoItem/TodoItem';
import './Todos.css';

const Todos = () => {
    // שליפת הפרמטרים מה-URL
    const { todoId } = useParams();
    // שליפת המשתמש הנוכחי מהקונטקסט
    const { currentUser } = UserContext();
    // שליפת הנתונים והפונקציות מהקונטקסט של המשימות
    const { allTodos, setAllTodos, dataChanged, setDataChanged } = TodosContext();

    // מצב מקומי לניהול תצוגת המשימות, מיון וחיפוש
    const [displayState, setDisplayState] = useState({
        displayedTodos: [],
        sortBy: 'id',
        searchQuery: ''
    });

    // טעינת המשימות כאשר המשתמש הנוכחי משתנה
    useEffect(() => {
        // פונקציה אסינכרונית לטעינת המשימות
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
                alert("Somesing went wrong. Please try again later.");
            }
        };
        if (currentUser?.id) fetchTodos();
    }, [currentUser?.id]);

    // עדכון התצוגה כאשר יש שינוי בנתונים הגלובליים
    useEffect(() => {
        if (dataChanged) {
            handleSearch();
            setDataChanged(false);
        }
    }, [dataChanged, allTodos]);

    // פונקציה למיון הנתונים לפי קריטריון מסוים
    const sortData = (data, criteria) => {
        return [...data].sort((a, b) => a[criteria] < b[criteria] ? -1 : 1);
    };

    // פונקציה לטיפול בחיפוש
    const handleSearch = () => {
        const filtered = allTodos.filter(todo =>
            todo.title.toLowerCase().includes(displayState.searchQuery.toLowerCase())
        );
        setDisplayState(prev => ({
            ...prev,
            displayedTodos: sortData(filtered, prev.sortBy)
        }));
    };

    // טיפול בשינוי המיון
    const handleSortChange = (e) => {
        const newSortBy = e.target.value;
        setDisplayState(prev => {
            const sorted = sortData(prev.displayedTodos, newSortBy);
            return { ...prev, sortBy: newSortBy, displayedTodos: sorted };
        });
    };

    // פונקציה למחיקת משימה
    const handleDelete = async (id) => {
        // טיפול במקרה של משימה חדשה שעוד לא נשמרה
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
            alert("Somesing went wrong. Please try again later.");
        }
    };

    return (
        <div className={'todos-container' + (todoId ? ' disabled-view' : '')}>
            {/* כותרת עם סרגל חיפוש וכפתור הוספת משימה חדשה */}
            <header className="todos-header">
                <div className="search-bar">
                    {/* בחירת קריטריון המיון */}
                    <select value={displayState.sortBy} onChange={handleSortChange}>
                        <option value="id">ID</option>
                        <option value="title">Title</option>
                        <option value="completed">Execution</option>
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