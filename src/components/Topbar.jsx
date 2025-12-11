import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiSun, FiMoon, FiMenu } from "react-icons/fi";

const Topbar = ({ toggleSidebar }) => {
    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="
            fixed top-0 left-0 right-0 z-50
            backdrop-blur-md shadow-lg px-4 py-3
            flex items-center justify-between
            bg-white/70 dark:bg-gray-900/70
        ">
            {/* MOBILE MENU BUTTON */}
            <button
                onClick={toggleSidebar}
                className="md:hidden text-2xl text-gray-700 dark:text-gray-200"
            >
                <FiMenu />
            </button>


            <div className="flex items-center gap-3 ml-auto">
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700
                               flex items-center justify-center
                               text-gray-800 dark:text-gray-200 transition"
                >
                    {theme === "dark" ? <FiSun /> : <FiMoon />}
                </button>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl shadow"
                >
                    <FiLogOut className="text-lg" />
                </button>
            </div>
        </div>
    );
};

export default Topbar;
