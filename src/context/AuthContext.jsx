import React, { createContext, useState, useEffect } from "react";
import api, { setAuthToken } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
            const userData = JSON.parse(localStorage.getItem("user"));
            setUser(userData);
        }
    }, []);

    const telegramLogin = async (telegramData) => {
        try {
            const res = await api.post("/auth/telegram-login", telegramData);
            const { token, user } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setAuthToken(token);
            setUser(user);
        } catch (err) {
            console.log(err.response?.data || err.message);
            alert("Login xatosi");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, telegramLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
