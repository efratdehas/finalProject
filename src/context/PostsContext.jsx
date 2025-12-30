import { createContext, useState, useContext } from 'react';

export const context = createContext();

export const PostsProvider = ({ children }) => {
    const [othersPosts, setOthersPosts] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [dataChanged, setDataChanged] = useState(false);

    return (
        <context.Provider value={{ 
            othersPosts, setOthersPosts, 
            myPosts, setMyPosts, 
            dataChanged, setDataChanged 
        }}>
            {children}
        </context.Provider>
    );
};

export const PostsContext = () => {
    return useContext(context);
};