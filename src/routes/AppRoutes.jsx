import { Routes, Route, Navigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import TelegramLogin from "../pages/TelegramLogin";
import AdminDashboard from "../pages/AdminDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";

export default function AppRoutes() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
            const userData = JSON.parse(localStorage.getItem("user"));
            setUser(userData);
        }

        setLoading(false);
    }, [user]);

    if (loading) return <div>Loading...</div>; // yoki spinner

    return (
        <Routes>
            <Route path="/" element={<TelegramLogin />} />
            <Route
                path="/dashboard"
                element={
                    !user ? (
                        <Navigate to="/" />
                    ) : user.role === "admin" && user.isApproved ? (
                        <AdminDashboard />
                    ) : (
                        <TeacherDashboard />
                    )
                }
            />
        </Routes>
    );
}
