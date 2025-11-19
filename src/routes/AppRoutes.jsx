import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import TelegramLogin from "../pages/TelegramLogin";
import AdminDashboard from "../pages/AdminDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";

export default function AppRoutes() {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/" element={<TelegramLogin />} />
            <Route
                path="/dashboard"
                element={
                    !user ? (
                        <Navigate to="/" />
                    ) : user.role === "admin" ? (
                        <AdminDashboard />
                    ) : (
                        <TeacherDashboard />
                    )
                }
            />
        </Routes>
    );
}
