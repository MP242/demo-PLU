'use client'

import { useState, useEffect } from 'react';

interface AlertProps {
    message: string;
    onClose: () => void;
}

const AlertError = ({ message, onClose }: AlertProps) => {
    const [visible, setVisible] = useState(message === '' ? false : true);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
            onClose();
        }, 10000);
        return () => clearTimeout(timeout);
    }, [onClose]);

    return (
        <div
            className={`fixed left-0 bottom-0 w-full bg-red-500 text-white p-4 transform ${visible ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out`}
        >
            <p>{message}</p>
        </div>
    );
};

export default AlertError;
