import React from "react";
import { FaChalkboardTeacher, FaClipboardList, FaHome, FaLayerGroup, FaStar, FaUserGraduate } from "react-icons/fa";
import { NavLink } from "react-router-dom";


const Sidebar = ({ role }) => {
    const links = [
        { name: "Dashboard", icon: <FaHome />, path: "/dashboard", roles: ["admin", "superadmin", "teacher"] },
        { name: "Admins", icon: <FaStar />, path: "/admins", roles: ["superadmin"] },
        { name: "Students", icon: <FaUserGraduate />, path: "/students", roles: ["admin", "superadmin", "teacher"] },
        { name: "Teachers", icon: <FaChalkboardTeacher />, path: "/teachers", roles: ["admin", "superadmin"] },
        { name: "Groups", icon: <FaLayerGroup />, path: "/groups", roles: ["admin", "superadmin"] },
        { name: "Attendance", icon: <FaClipboardList />, path: "/attendance", roles: ["admin", "superadmin", "teacher"] },
    ];

    const filteredLinks = links.filter(link => link.roles.includes(role));

    return (
        <div className="w-72 bg-white h-screen p-6 flex flex-col shadow-lg">
            <div className="flex gap-5 justify-center items-start">
                <img src="/logo.png" alt="Logo" className="w-10" />
                <h1 className="text-xl font-bold mb-8 text-red-700">Davomat</h1>
            </div>
            <ul className="flex flex-col gap-4 text-gray-700">
                {filteredLinks.map(link => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-xl transition-colors duration-200 ${isActive ? "bg-green-100 text-green-600" : "hover:bg-gray-100"}`
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