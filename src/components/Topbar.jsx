import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Topbar = ({ user }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="
            fixed top-0 right-0 z-50
            left-[300px]   bg-white/80 backdrop-blur-md
            p-4 shadow-lg flex justify-between items-center
        ">

            <div className="flex items-center gap-4 ml-auto">
                <span className="text-gray-500 capitalize">{user?.role}</span>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 
                                text-white px-4 py-2 rounded-xl shadow transition-all"
                >
                    <FiLogOut className="text-lg" />
                </button>
            </div>
        </div>
    );
};

export default Topbar;
