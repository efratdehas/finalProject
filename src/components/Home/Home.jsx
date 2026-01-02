import { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentUser, isMenuOpen, setIsMenuOpen } = UserContext();

    useEffect(() => {
        const currentUserId = String(currentUser?.id);
        const urlId = String(id);

        if (currentUser && urlId !== currentUserId) {

            const correctedPath = location.pathname.replace(
                `/users/${urlId}`,
                `/users/${currentUserId}`
            );
            if (correctedPath !== location.pathname) {
                console.log("Fixing URL ID...");
                navigate(correctedPath, { replace: true });
            }
        }
    }, [id, currentUser?.id, navigate, location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        window.location.reload();
    };

    return (
        <div className="home-container">
            <nav className="top-navbar">
                {/* צד שמאל: לוגו */}
                <div
                    className="nav-left"
                    onClick={() => navigate(`/users/${currentUser?.id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <img src="/logoIcon.png" alt="Logo Icon" className="nav-logo-icon" />
                    <img src="/logoText.png" alt="logo text" className="nav-logo-text" />
                </div>

                {isMenuOpen && (
                    <div className={`nav-center ${isMenuOpen ? 'open' : 'closed'}`}>
                        <button className="nav-link" onClick={() => navigate('info')}>Profile</button>
                        <button className="nav-link" onClick={() => navigate('todos')}>Todos</button>
                        <button className="nav-link" onClick={() => navigate('posts')}>Posts</button>
                        <button className="nav-link" onClick={() => navigate('albums')}>Albums</button>
                    </div>
                )}

                <div className="nav-right">

                    <button
                        className={`nav-icon-btn menu-toggle ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>

                    <button className="nav-icon-btn" onClick={() => handleLogout()}>
                        <img src="/logOutIcon.png" alt="Logout" className="logout-icon" />
                    </button>
                </div>
            </nav>

            <div className="content-layout">
                {/* תוכן מרכזי */}
                <main className="main-viewport">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};


export default Home;