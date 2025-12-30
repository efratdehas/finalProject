import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './UserDetailsForm.css';

const UserDetailsForm = ({ isNewUser }) => {

    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = UserContext();

    // Initialize state with currentUser props or empty values
    const [formData, setFormData] = useState({
        id: currentUser?.id || '',
        name: currentUser?.name || '',
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        address: {
            street: currentUser?.address?.street || '',
            suite: currentUser?.address?.suite || '',
            city: currentUser?.address?.city || '',
            zipcode: currentUser?.address?.zipcode || '',
            geo: {
                lat: currentUser?.address?.geo?.lat || '',
                lng: currentUser?.address?.geo?.lng || ''
            }
        },
        phone: currentUser?.phone || '',
        website: currentUser?.website || '',
        company: {
            name: currentUser?.company?.name || '',
            catchPhrase: currentUser?.company?.catchPhrase || '',
            bs: currentUser?.company?.bs || ''
        }
    });
    const [message, setMessage] = useState(null);

    // Handle input changes for both top-level and nested properties
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Support for nested object updates (e.g., name="address.city")
        if (name.includes('.')) {
            const [parent, child, grandChild] = name.split('.');
            setFormData(prev => {
                if (grandChild) {
                    return {
                        ...prev,
                        [parent]: {
                            ...prev[parent],
                            [child]: { ...prev[parent][child], [grandChild]: value }
                        }
                    };
                }
                return {
                    ...prev,
                    [parent]: { ...prev[parent], [child]: value }
                };
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let dataToSend = { ...formData };

        if (isNewUser) {
            delete dataToSend.id;
        }

        try {
            const url = isNewUser ? 'http://localhost:3000/users' : `http://localhost:3000/users/${formData.id}`;
            const method = isNewUser ? 'POST' : 'PATCH';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                const savedUser = await response.json();

                // Synchronize global state and storage
                setCurrentUser(savedUser);
                localStorage.setItem('currentUser', JSON.stringify(savedUser));

                setMessage(isNewUser ? 'Registration successful!' : 'Profile updated!');

                setTimeout(() => {
                    setMessage(null);
                    isNewUser ? navigate(`/users/${savedUser.id}`) : navigate(`/users/${savedUser.id}/info`);
                }, 1000);

            }
        } catch (err) {
            console.error("Submission error:", err);

            setMessage('An error occurred. Please try again.');

            setTimeout(() => {
                setMessage(null);
            }, 1000);
        }
    };

    return (
        <div className="form-container">
            {(message &&
                <div className="overlay">
                    <div className="small-square">
                        <p>{message}</p>
                    </div>
                </div>
            )}

            <h2>{isNewUser ? 'Complete Registration' : 'Edit Profile'}</h2>
            <form onSubmit={handleSubmit} className="user-details-form">

                {/* General Information Section */}
                <section className="form-section">
                    <h3>General Info</h3>
                    <input name="username" value={formData.username} placeholder="Username" disabled title="Username cannot be changed" />
                    <input name="name" value={formData.name} placeholder="Full Name" onChange={handleChange} required />
                    <input name="email" value={formData.email} type="email" placeholder="Email" onChange={handleChange} required />
                    <div className="input-row">
                        <input name="phone" value={formData.phone} placeholder="Phone" onChange={handleChange} />
                        <input name="website" value={formData.website} placeholder="Website" onChange={handleChange} />
                    </div>
                </section>

                {/* Address Section */}
                <section className="form-section">
                    <h3>Address</h3>
                    <div className="input-row">
                        <input name="address.street" value={formData.address?.street} placeholder="Street" onChange={handleChange} />
                        <input name="address.city" value={formData.address?.city} placeholder="City" onChange={handleChange} />
                    </div>
                    <div className="input-row">
                        <input name="address.zipcode" value={formData.address?.zipcode} placeholder="Zipcode" onChange={handleChange} />
                        <input name="address.suite" value={formData.address?.suite} placeholder="Suite/Apt" onChange={handleChange} />
                    </div>
                </section>

                {/* Company Section */}
                <section className="form-section">
                    <h3>Company</h3>
                    <input name="company.name" value={formData.company?.name} placeholder="Company Name" onChange={handleChange} />
                    <input name="company.catchPhrase" value={formData.company?.catchPhrase} placeholder="Catchphrase" onChange={handleChange} />
                </section>

                <button type="submit">{isNewUser ? 'Finish Registration' : 'Save Changes'}</button>
            </form>
        </div>
    );
};

export default UserDetailsForm;