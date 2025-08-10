import React, {createContext, useContext, ReactNode, useState} from 'react';

type Log = {
    id: string;
    message: string;
    timestamp: Date;
};

type LogContextType = {
    logs: Log[];
    addLog: (message: string) => void;
    clearLogs: () => void;
};

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({children}: { children: ReactNode }) {
    const [logs, setLogs] = useState<Log[]>([]);

    const addLog = (message: string) => {
        const newLog: Log = {
            id: Math.random().toString(36).substring(2, 9),
            message,
            timestamp: new Date(),
        };
        setLogs((prev) => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
    };

    const clearLogs = () => setLogs([]);

    return (
        <LogContext.Provider value={{logs, addLog, clearLogs}}>
            {children}
        </LogContext.Provider>
    );
}

export function useLogs() {
    const context = useContext(LogContext);
    if (!context) {
        throw new Error('useLogs must be used within a LogProvider');
    }
    return context;
}