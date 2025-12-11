import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { FaHome, FaStar, FaUserGraduate, FaLayerGroup, FaClipboardList, FaChalkboardTeacher } from "react-icons/fa";
import { AiTwotoneProfile } from "react-icons/ai";


const Sidebar = ({ role, open, closeSidebar }) => {
    const { theme } = useContext(ThemeContext);

    const links = [
        { name: "Dashboard", icon: <FaHome />, path: "/dashboard", roles: ["admin", "superadmin", "teacher"] },
        { name: "Adminlar", icon: <FaStar />, path: "/admins", roles: ["superadmin"] },
        { name: "Students", icon: <FaUserGraduate />, path: "/students", roles: ["admin", "superadmin", "teacher"] },
        { name: "Teachers", icon: <FaChalkboardTeacher />, path: "/teachers-approve", roles: ["admin", "superadmin"] },
        { name: "Groups", icon: <FaLayerGroup />, path: "/groups", roles: ["admin", "superadmin"] },
        { name: "Attendance", icon: <FaClipboardList />, path: "/Attendance", roles: ["admin", "superadmin", "teacher"] },
    ];

    const filteredLinks = links.filter(l => l.roles.includes(role));

    return (
        <>
            {/* BACKDROP FOR MOBILE */}
            {open && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 bg-black/40 md:hidden z-40"
                />
            )}

            <div
                className={`
                    fixed top-0 left-0 h-full w-72 z-50
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-80 md:translate-x-0"}
                    ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"}
                    shadow-xl p-6 flex flex-col
                `}
            >
                <span className="absolute bottom-10 left-10 text-gray-600 dark:text-gray-300 capitalize text-sm sm:text-base">
                    {role}
                </span>
                <div className="flex gap-4 items-center mb-10">
                    <img src="/logo.png" className="w-12" />
                    <h1 className='text-red-700 text-2xl font-bold leading-6'>
                        <Link to={"/dashboard"}>Cambridge Davomat</Link>

                    </h1>
                </div>

                <ul className="flex flex-col gap-4">
                    {filteredLinks.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-xl 
                                transition duration-200 text-lg
                                ${isActive
                                    ? "bg-red-600 text-white shadow-lg"
                                    : theme === "dark"
                                        ? "hover:bg-gray-700"
                                        : "hover:bg-gray-100"}`
                            }
                        >
                            {link.icon} {link.name}
                        </NavLink>
                    ))}

                </ul>
            </div>
        </>
    );
};

export default Sidebar;
