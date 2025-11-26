import React, { useContext } from "react";
import { FaChalkboardTeacher, FaClipboardList, FaHome, FaLayerGroup, FaStar, FaUserGraduate } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Sidebar = ({ role }) => {
    const { theme } = useContext(ThemeContext);

    const links = [
        { name: "Dashboard", icon: <FaHome />, path: "/dashboard", roles: ["admin", "superadmin", "teacher"] },
        { name: "Adminlar", icon: <FaStar />, path: "/admins", roles: ["superadmin"] },
        { name: "Students", icon: <FaUserGraduate />, path: "/students", roles: ["admin", "superadmin", "teacher"] },
        { name: "Teachers", icon: <FaChalkboardTeacher />, path: "/teachers", roles: ["admin", "superadmin"] },
        { name: "Groups", icon: <FaLayerGroup />, path: "/groups", roles: ["admin", "superadmin"] },
        { name: "Attendance", icon: <FaClipboardList />, path: "/attendance", roles: ["admin", "superadmin", "teacher"] },
    ];

    const filteredLinks = links.filter(link => link.roles.includes(role));

    return (
        <div className={`w-72 h-screen p-6 flex flex-col shadow-lg ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"}`}>
            <div className="flex gap-5 justify-center items-start mb-8">
                <img src="/logo.png" alt="Logo" className="w-10" />
                <h1 className={`${theme === "dark" ? "text-red-400" : "text-red-800"} text-xl font-bold`}>Davomat</h1>
            </div>
            <ul className="flex flex-col gap-4">
                {filteredLinks.map(link => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl transition-colors duration-200 
                            ${isActive ? (theme === "dark" ? "bg-red-800 text-white" : "bg-red-100 text-red-600")
                                : (theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100")}`
                        }
                    >
                        {link.icon} {link.name}
                    </NavLink>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
