import { createContext, useState, useContext } from 'react';

const context = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isMenuOpen, setIsMenuOpen] = useState(true);

    return (
        <context.Provider value={{ currentUser, setCurrentUser, isMenuOpen, setIsMenuOpen }}>
            {children}
        </context.Provider>
    );
};

export const UserContext = () => {
    return useContext(context);
};