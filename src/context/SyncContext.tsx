import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface SyncItem {
    id: string;
    type: 'inspection_submit' | 'image_upload';
    data: any;
    timestamp: number;
    status: 'pending' | 'synced' | 'failed';
}

interface SyncContextType {
    queue: SyncItem[];
    addToQueue: (type: SyncItem['type'], data: any) => void;
    retryItem: (id: string) => void;
    clearSynced: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: ReactNode }) => {
    const [queue, setQueue] = useState<SyncItem[]>([]);

    const addToQueue = (type: SyncItem['type'], data: any) => {
        const newItem: SyncItem = {
            id: Date.now().toString(),
            type,
            data,
            timestamp: Date.now(),
            status: 'pending',
        };
        setQueue((prev) => [newItem, ...prev]);
    };

    const retryItem = (id: string) => {
        setQueue((prev) => prev.map(item =>
            item.id === id ? { ...item, status: 'pending' } : item
        ));
        // Logic to actually retry the API call would go here
    };

    const clearSynced = () => {
        setQueue((prev) => prev.filter(item => item.status !== 'synced'));
    };

    return (
        <SyncContext.Provider value={{ queue, addToQueue, retryItem, clearSynced }}>
            {children}
        </SyncContext.Provider>
    );
};

export const useSync = () => {
    const context = useContext(SyncContext);
    if (!context) {
        throw new Error("useSync must be used within a SyncProvider");
    }
    return context;
};
