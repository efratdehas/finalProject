// import { useState } from 'react'
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { UserProvider } from './context/UserContext';
// import { useUser } from './context/UserContext';

// import Login from './components/Login/Login'
// import Register from './components/Register/Register'
// import Home from './components/Home/Home'
// import UserDetailsForm from './components/UserDetailsForm/UserDetailsForm'
// import Todos from './components/Todos/Todos'
// import Posts from './components/Posts/Posts'
// import Albums from './components/Albums/Albums'
// import Info from './components/Info/Info'
// import './App.css'

// function App() {

//   // const [currentUser, setCurrentUser] = useState(() => {
//   //   const savedUser = localStorage.getItem('currentUser');
//   //   return savedUser ? JSON.parse(savedUser) : null;
//   // });
//   const { currentUser } = useUser();  

//   return (
//     <>
//       <UserProvider>
//         <BrowserRouter>
//           <Routes>
//             {/* default */}
//             <Route path="/" element={currentUser ? <Navigate to={`/users/${currentUser.id}`} /> : <Navigate to="/login" />} />

//             <Route path="/login" element={<Login />} />

//             <Route path="/register">
//               <Route index element={<Register/>} />
//               <Route path="info" element={<UserDetailsForm isNewUser={true} />} />
//             </Route>

//             <Route
//               path="/users/:id"
//               element={currentUser ? <Home /> : <Navigate to="/login" />}
//             >
//               <Route index element={<h1>Hi, {currentUser?.name || 'User'}!</h1>} />
//               <Route path="todos" element={<Todos />} />
//               <Route path="posts" element={<Posts />} />
//               <Route path="albums" element={<Albums />} />
//               <Route path="info" element={<Info />} />
//               <Route path="info/edit" element={<UserDetailsForm isNewUser={false}/>} />
//             </Route>

//           </Routes>
//         </BrowserRouter >
//       </UserProvider>
//     </>
//   )
// }

// export default App


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider, UserContext } from './context/UserContext';
import { TodosProvider } from './context/TodosContext';
import { PostsProvider } from './context/PostsContext';

import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Home from './components/Home/Home'
import UserDetailsForm from './components/UserDetailsForm/UserDetailsForm'
import Info from './components/Info/Info'
import Todos from './components/Todos/Todos'
import Posts from './components/Posts/Posts'
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
        <Route path="todos" element={<TodosProvider><Todos /></TodosProvider>}/>
        <Route path="posts" element={<PostsProvider><Posts /></PostsProvider>} />
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