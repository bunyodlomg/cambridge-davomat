import React, { createContext, useState } from "react";
import axiosInstance from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async ({ role, email, password, telegramUser }) => {
        if (role === "admin" || role === "superadmin") {
            // Admin login (email + password)
            const res = await axiosInstance.post("/auth/admin-login", { email, password });
            setUser(res.data.user);
            localStorage.setItem("token", res.data.token);
            return res.data;
        } else if (role === "teacher") {
            // Teacher login (Telegram)
            const res = await axiosInstance.post("/auth/telegram-login", telegramUser);
            setUser(res.data.user);
            localStorage.setItem("token", res.data.token);
            return res.data;
        } else {
            throw new Error("Invalid role for login");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
