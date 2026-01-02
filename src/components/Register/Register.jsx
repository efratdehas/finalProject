import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { useFetch } from '../../context/useFetch';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { setCurrentUser } = UserContext();
    
    // שליפת הכלים מההוק בשורה הראשונה
    const { isLoading, sendRequest } = useFetch();

    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        verifyPassword: '',
        error: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value, error: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ולדציה בסיסית
        if (!formData.userName || !formData.password || !formData.verifyPassword) {
            setFormData({ ...formData, error: 'Please fill all fields' });
            return;
        }

        if (formData.password !== formData.verifyPassword) {
            setFormData({ ...formData, error: 'Passwords do not match' });
            return;
        }

        try {
            // בדיקה אם שם המשתמש תפוס באמצעות ההוק הגנרי
            const existingUsers = await sendRequest(`http://localhost:3000/users?username=${formData.userName}`);

            if (existingUsers && existingUsers.length > 0) {
                setFormData({ ...formData, error: 'Username already exists!' });
                return;
            }

            // שמירה זמנית של הפרטים ומעבר לשלב הבא
            setCurrentUser({
                username: formData.userName,
                website: formData.password
            });

            navigate('/register/info');

        } catch (error) {
            // השגיאה כבר מטופלת בתוך useHttp, אבל כאן אנחנו מעדכנים את ה-UI המקומי
            setFormData({ ...formData, error: 'An error occurred. Please try again later.' });
        }
    };

    return (
        <div className="signupContainer">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="userName"
                    placeholder="User Name"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="verifyPassword"
                    placeholder="Verify Password"
                    value={formData.verifyPassword}
                    onChange={handleChange}
                    required
                />

                {/* הכפתור מנוטרל בזמן טעינה */}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Checking...' : 'Sign Up'}
                </button>
            </form>
            
            <p className="error-container">
                {formData.error && <span className="error">{formData.error}</span>}
            </p>
            
            <p>
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')}>Login</button>
            </p>
        </div>
    );
};

export default Register;