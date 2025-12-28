import './Home.css';

const Home = ({ currentUser }) => {
    return (
        <p>currentUser: {currentUser.username}</p>
    );
};

export default Home;