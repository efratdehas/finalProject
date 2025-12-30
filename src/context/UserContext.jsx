import { createContext, useState, useContext } from 'react';

const context = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    return (
        <context.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </context.Provider>
    );
};

export const UserContext = () => {
    return useContext(context);
};