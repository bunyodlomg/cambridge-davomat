import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const telegramLogin = async (telegramUser) => {
        const res = await axios.post("/api/auth/telegram-login", telegramUser);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        return res.data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, telegramLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
