import React, { createContext, useState } from "react";
import axiosInstance from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async ({ role, email, password, telegramUser }) => {
        let res;

        if (role === "admin") {
            res = await axiosInstance.post("/auth/admin-login", { email, password });
        } 
        else if (role === "teacher") {
            res = await axiosInstance.post("/auth/telegram-login", telegramUser);
        } 
        else {
            throw new Error("Invalid role for login");
        }

        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        return res.data;
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
