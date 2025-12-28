import { useState } from 'react'
import Signup from './Signup/Signup'
import Login from './Login/Login'
import Logout from './Logout/Logout'

const UserManager = ({ currentUser, setCurrentUser }) => {

  const [authType, setAuthType] = useState('login');

  return (
    <div className="userManagerContainer">
      {currentUser ? (
        <Logout setCurrentUser={setCurrentUser} />
      ) : (
        <>
          {authType === 'signup' && (
            <Signup
              setCurrentUser={setCurrentUser}
              onSwitch={() => setAuthType('login')}
            />
          )}

          {authType === 'login' && (
            <Login
              setCurrentUser={setCurrentUser}
              onSwitch={() => setAuthType('signup')}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserManager;