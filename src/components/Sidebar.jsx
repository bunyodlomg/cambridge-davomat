import React from "react";

import { NavLink } from "react-router-dom";
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaLayerGroup, FaClipboardList } from "react-icons/fa";

const Sidebar = () => {
    const links = [
        { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
        { name: "Students", icon: <FaUserGraduate />, path: "/students" },
        { name: "Teachers", icon: <FaChalkboardTeacher />, path: "/teachers" },
        { name: "Groups", icon: <FaLayerGroup />, path: "/groups" },
        { name: "Attendance", icon: <FaClipboardList />, path: "/attendance" },
    ];

    return (
        <div className="w-72 bg-white h-screen p-6 flex flex-col shadow-lg">
            <h1 className="text-2xl font-bold mb-8 text-green-600">Maktab Panel</h1>
            <ul className="flex flex-col gap-4 text-gray-700">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl transition-colors duration-200 ${isActive ? "bg-green-100 text-green-600" : "hover:bg-gray-100"
                            }`
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
