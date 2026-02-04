import { useState , createContext , useContext } from "react";

const [userName, setUserName] = useState(null);

const userNameContext = createContext(null); 

export const userNameContextProvider = ({children}) => {
    const value = { userName , setUserName};
    return (
        <userNameContextProvider.Provider value={value}>
            {children}
        </userNameContextProvider.Provider>
    );
};

export const useUserName = () => {
    const context = useContext(userNameContext);

    return context;
}