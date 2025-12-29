import { useNavigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Info.css';

const Info = () => {
    
    const navigate = useNavigate();
    const { currentUser } = useUser(); // שליפה ישירה

    if (!currentUser) return <p>Loading...</p>;

    return (
        <div className="info-page-wrapper">
            <div className="info-container">
                <div className="info-header">
                    <h2>User Profile</h2>
                    <button
                        className="edit-profile-btn"
                        onClick={() => navigate('edit')}
                        title="Edit Profile"
                    >✎</button>
                </div>

                {/* General Info */}
                <section className="info-section">
                    <h3>General Info</h3>
                    <div className="info-row">
                        <label>Name:</label>
                        <p>{currentUser.name}</p>
                    </div>
                    <div className="info-row">
                        <label>Username:</label>
                        <p>{currentUser.username}</p>
                    </div>
                    <div className="info-row">
                        <label>Email:</label>
                        <p>{currentUser.email}</p>
                    </div>
                    <div className="info-row">
                        <label>Phone:</label>
                        <p>{currentUser.phone}</p>
                    </div>
                </section>

                {/* Address Info */}
                <section className="info-section">
                    <h3>Address</h3>
                    <div className="info-row">
                        <label>Street:</label>
                        <p>{currentUser.address?.street}, {currentUser.address?.suite}</p>
                    </div>
                    <div className="info-row">
                        <label>City:</label>
                        <p>{currentUser.address?.city} ({currentUser.address?.zipcode})</p>
                    </div>
                </section>

                {/* Company Info */}
                <section className="info-section">
                    <h3>Company</h3>
                    <div className="info-row">
                        <label>Name:</label>
                        <p>{currentUser.company?.name}</p>
                    </div>
                    <div className="info-row">
                        <label>Catchphrase:</label>
                        <p className="italic">"{currentUser.company?.catchPhrase}"</p>
                    </div>
                </section>
            </div>

            {/* כאן יוצג טופס העריכה כשננווט ל- info/edit */}
            <Outlet />
        </div>
    );
};

export default Info;