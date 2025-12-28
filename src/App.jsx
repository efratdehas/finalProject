import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Home from './components/Home/Home'
import UserDetailsForm from './components/UserDetailsForm/UserDetailsForm'
import './App.css'

function App() {

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* default */}
          <Route path="/" element={currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />} />

          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />

          <Route path="/register">
            <Route index element={<Register setCurrentUser={setCurrentUser} />} />
            <Route path="info" element={<UserDetailsForm isNewUser={true} currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          </Route>

          <Route path="/home" element={currentUser ? <Home currentUser={currentUser} /> : <Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
