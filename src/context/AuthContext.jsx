import React, { createContext, useState, useEffect } from "react";
import api, { setAuthToken } from "../services/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
            navigate("/dashboard");
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
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, telegramLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
