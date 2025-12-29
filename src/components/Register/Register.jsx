import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Register.css';

const Register = () => {

    const navigate = useNavigate();
    const { setCurrentUser } = useUser();

    // Local state to manage form inputs and validation errors
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        verifyPassword: '',
        error: ''
    });

    // Update local state on every keystroke
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation: ensure no fields are empty
        if (!formData.userName || !formData.password || !formData.verifyPassword) {
            setFormData({ ...formData, error: 'Please fill all fields' });
            return;
        }

        // Validation: check if password and confirmation match
        if (formData.password !== formData.verifyPassword) {
            setFormData({ ...formData, error: 'Passwords do not match' });
            return;
        }

        try {
            // Check if the username is already taken by querying the server
            const res = await fetch(`http://localhost:3000/users?username=${formData.userName}`);
            const existingUsers = await res.json();

            if (existingUsers.length > 0) {
                setFormData({ ...formData, error: 'Username already exists!' });
                return;
            }

            // Temporarily save basic info to global state before moving to Step 2
            setCurrentUser({
                username: formData.userName,
                website: formData.password
            });

            // Navigate to the extended info form (Step 2)
            navigate('/register/info');

        } catch (error) {
            console.error('Error during registration process:', error);
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
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="verifyPassword"
                    placeholder="Verify Password"
                    value={formData.verifyPassword}
                    onChange={handleChange}
                />

                <button type="submit">Sign Up</button>

            </form>
            <p>
                {/* Display validation or server errors if they exist */}
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