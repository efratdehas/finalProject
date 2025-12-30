import { createContext, useState, useContext } from 'react';

const context = createContext();

export const TodosProvider = ({ children }) => {

    const [allTodos, setAllTodos] = useState([]);
    const [dataChanged, setDataChanged] = useState(false);

    return (
        <context.Provider value={{ allTodos, setAllTodos, dataChanged, setDataChanged }}>
            {children}
        </context.Provider>
    );
};

export const TodosContext = () => useContext(context);