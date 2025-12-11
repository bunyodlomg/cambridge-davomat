import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { AuthContext } from "../context/AuthContext";

const MainLayout = () => {
    const { user } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800">

            {/* TOPBAR */}
            {user && (
                <Topbar
                    user={user}
                    toggleSidebar={() => setSidebarOpen(true)}
                />
            )}

            {/* SIDEBAR */}
            {user && (
                <Sidebar
                    role={user.role}
                    open={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                />
            )}

            {/* MAIN CONTENT */}
            <div className="pt-20 md:ml-72 p-4 transition-all">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
