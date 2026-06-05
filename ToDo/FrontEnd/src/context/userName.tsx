import React, { useState, createContext, useContext } from "react";
import type { ReactNode } from "react";
export interface UserNameContextType {
    userName: string | null;
    setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserNameContext = createContext<UserNameContextType | null>(null);

export const UserNameContextProvider = ({ children } : { children: ReactNode }) => {
    const [userName, setUserName] = useState<string | null>(null);
    const value = { userName, setUserName };
    
    return (
        <UserNameContext.Provider value={value}>
            {children}
        </UserNameContext.Provider>
    );
};

export const useUserName = () => {
    const context = useContext(UserNameContext);
    return context;
}