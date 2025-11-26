import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";

const Topbar = ({ user }) => {
    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className={`fixed top-3 right-1 left-[300px] z-50 p-4 shadow-lg flex justify-between items-center rounded-2xl 
            backdrop-blur-md dark:bg-gray-900/80  dark:border-gray-700  transition-colors`}>
            <span className="text-gray-500 dark:text-gray-300 capitalize">{user?.role}</span>

            <div className="flex items-center gap-4 ml-auto">

                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
                >
                    {theme === "dark" ? <FiSun /> : <FiMoon />}
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow transition-all"
                >
                    <FiLogOut className="text-lg" />
                </button>
            </div>
        </div>
    );
};

export default Topbar;
