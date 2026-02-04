import { createContext, useContext } from "react";
import axiosInstance from '../api/axiosInstance'

const TodoContext = createContext(null);

export const TodoProvider = ({children} , userName) => {
    
    const todos = axiosInstance.get(`/todos/${userName}`);

    const value = { todos };
    
    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    )
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    return context;
}