import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { AuthContext } from "../context/AuthContext";

const MainLayout = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-800">
            {/* FIXED SIDEBAR */}
            {user && (
                <div className="fixed left-0 top-0 h-full w-72 z-50">
                    <Sidebar role={user.role} />
                </div>
            )}

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col ml-72">
                {user && <Topbar user={user} />}

                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
