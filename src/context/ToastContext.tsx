import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastType } from '../components/Toast';

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('info');
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const showToast = useCallback((msg: string, toastType: ToastType = 'info', duration: number = 3000) => {
        if (timer) clearTimeout(timer);

        setMessage(msg);
        setType(toastType);
        setVisible(true);

        const newTimer = setTimeout(() => {
            setVisible(false);
        }, duration);

        setTimer(newTimer);
    }, [timer]);

    const hideToast = useCallback(() => {
        if (timer) clearTimeout(timer);
        setVisible(false);
    }, [timer]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <Toast
                visible={visible}
                message={message}
                type={type}
                onHide={hideToast}
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
