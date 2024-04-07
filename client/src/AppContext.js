import React, { createContext } from 'react'; 

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const API_URL = process.env.NODE_ENV === 'production' ? '/api/v1/game' : 'http://localhost:8000/api/v1/game';

    const contextValue = {
        API_URL
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppContext;