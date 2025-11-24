import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SuperAdminDashboard from "../pages/superadmin/superAdminDashboard";

const AppRoutes = () => {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Teacher Dashboard */}
            <Route
                path="/teacher"
                element={
                    user?.role === "teacher" ? (
                        <TeacherDashboard />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            {/* Admin Dashboard */}
            <Route
                path="/admin"
                element={
                    user?.role === "admin" ? (
                        <AdminDashboard />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            {/* Super Admin Dashboard */}
            <Route
                path="/superadmin"
                element={
                    user?.role === "superadmin" ? (
                        <SuperAdminDashboard />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            {/* Default fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
