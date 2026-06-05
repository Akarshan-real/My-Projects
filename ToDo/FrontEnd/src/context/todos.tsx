import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axiosInstance from '../lib/axiosInstance';

interface TodoContextType {
    todos: any;
}

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider = ({ children, userName }: { children: ReactNode, userName?: string | null }) => {
    const [todos, setTodos] = useState<any>(null);

    useEffect(() => {
        if (userName) {
            axiosInstance.get(`/todos/${userName}`).then(res => {
                setTodos(res.data);
            }).catch(console.error);
        }
    }, [userName]);

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