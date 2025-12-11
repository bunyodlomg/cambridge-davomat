import { motion, AnimatePresence } from "framer-motion";
import React, { createContext, useContext, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const show = ({ type = "success", message }) => {
        setNotification({ type, message });

        setTimeout(() => setNotification(null), 2500); // auto-close
    };

    const icons = {
        success: <FaCheckCircle className="text-green-500" />,
        error: <FaTimesCircle className="text-red-500" />,
        warning: <FaExclamationTriangle className="text-yellow-500" />
    };

    return (
        <NotificationContext.Provider value={{ show }}>
            {children}

            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="
                            fixed top-5 right-5 backdrop-blur-xs
                            bg-white/70 shadow-2xl border border-white/40 
                            rounded-2xl px-5 py-4 flex items-center gap-3
                            z-[9999]
                        "
                    >
                        {icons[notification.type]}
                        <p className="text-gray-800 font-medium">{notification.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </NotificationContext.Provider>
    );
}
