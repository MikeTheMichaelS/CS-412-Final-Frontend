import { createContext } from 'react';

export interface AppContextType {
    loggedIn: boolean;
    setContextFunc: (value: Partial<AppContextType>) => void;
}


export const AppContext = createContext({
    loggedIn: false,
    setContextFunc: (value: Partial<AppContextType>) => { },
});
