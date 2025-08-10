import React, {createContext, ReactNode} from 'react';

const LogContext = createContext({
    logs: [],
    addLog: () => {
    },
});

export function LogProvider({children}: { children: ReactNode }) {
    return (
        <LogContext.Provider value={{
            logs: [], addLog: () => {
            }
        }}>
            {children}
        </LogContext.Provider>
    );
}