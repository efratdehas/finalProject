import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { UserProvider, UserContext } from './context/UserContext';
// import { FetchProvider, useFetch } from './context/useFetch';
import { TodosProvider } from './context/TodosContext';
import { PostsProvider } from './context/PostsContext';

import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Home from './components/Home/Home'
import UserDetailsForm from './components/UserDetailsForm/UserDetailsForm'
import Info from './components/Info/Info'
import Todos from './components/Todos/Todos'
import Posts from './components/Posts/Posts'
import PostDetails from './components/PostDetails/PostDetails'
import Albums from './components/Albums/Albums'
import './App.css'

function AppRoutes() {
  const { currentUser } = UserContext();

  return (
    <Routes>
      {/* ברירת מחדל */}
      <Route path="/" element={currentUser ? <Navigate to={`/users/${currentUser.id}`} /> : <Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register">
        <Route index element={<Register />} />
        <Route path="info" element={<UserDetailsForm isNewUser={true} />} />
      </Route>

      <Route
        path="/users/:id"
        element={currentUser ? <Home /> : <Navigate to="/login" />}
      >
        <Route index element={<h1 style={{ color: '#6d0f0f' }}>Hi, {currentUser?.name || 'User'}!</h1>} />
        <Route path="todos" element={<TodosProvider><Todos /></TodosProvider>} />
        <Route path="posts" element={<PostsProvider><Outlet /></PostsProvider>}>
          <Route index element={<Posts />} />
          <Route path=":postID" element={<PostDetails />} />
        </Route>
        <Route path="albums" element={<Albums />} />
        <Route path="info" element={<Info />} />
        <Route path="info/edit" element={<UserDetailsForm isNewUser={false} />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;