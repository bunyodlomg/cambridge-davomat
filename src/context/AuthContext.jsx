import { createContext, useState, useContext } from "react";
import axios from "../api/axiosConfig"; // Axios konfiguratsiyasi

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    // Oddiy login (backenddan token bilan)
    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    // Telegram login funksiyasi
    const telegramLogin = async (userData) => {
        try {
            const res = await axios.post("/auth/telegram-login", userData);
            login(userData, res.data.token);
            return res.data;
        } catch (err) {
            console.error("Telegram login error:", err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, telegramLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
