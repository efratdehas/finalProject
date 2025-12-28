import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Login.css';

const Login = ({ setCurrentUser }) => {

    const navigate = useNavigate();

    // Local state to manage credentials and authentication feedback
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        error: null
    });

    // Synchronize input changes with local state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Fetch user from local server filtering by username
            const response = await fetch(`http://localhost:3000/users?username=${formData.username}`);
            const users = await response.json();

            if (users.length > 0) {
                const user = users[0];

                // Verify password (represented by the 'website' field in this project)
                if (user.website === formData.password) {

                    // Persistent storage to keep user logged in across refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    // Update global app state
                    setCurrentUser(user);

                    // Redirect to the home dashboard
                    navigate('/home');
                    return; // Exit to prevent setting the error state below
                } 
            }
        } catch (error) {
            console.error('Error connecting to server: ', error);
        }
        
        // Display error message if authentication fails
        setFormData({ ...formData, error: 'Invalid username or password' });
    }

    return (
        <div className="loginContainer">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="username" // Matches the key in formData
                    placeholder="User Name"
                    value={formData.username}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type="submit">Login</button>

            </form>
            <p>
                {/* Conditional rendering for authentication errors */}
                {formData.error && <span className="error">{formData.error}</span>}
            </p>
            <p>
                Don't have an account?{' '}
                <button type="button" onClick={() => navigate('/register')}>Sign Up</button>
            </p>
        </div>
    );
};

export default Login;