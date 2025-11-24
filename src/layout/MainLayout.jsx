import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { AuthContext } from "../context/AuthContext";

const MainLayout = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {user && <Sidebar role={user.role} />}
            <div className="flex-1 flex flex-col">
                {user && <Topbar user={user} />}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
