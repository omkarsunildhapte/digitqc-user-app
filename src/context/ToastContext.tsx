import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastType } from '../components/Toast';

interface ToastContextType {
    show: (message: string, type?: ToastType) => void;
    hide: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('info');

    const show = (msg: string, toastType: ToastType = 'info') => {
        setMessage(msg);
        setType(toastType);
        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
    };

    return (
        <ToastContext.Provider value={{ show, hide }}>
            {children}
            <Toast
                visible={visible}
                message={message}
                type={type}
                onHide={hide}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
