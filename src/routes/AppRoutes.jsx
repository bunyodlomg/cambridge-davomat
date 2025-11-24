import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Admins from "../pages/admin/Admins";
const AppRoutes = () => {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            {/* Login route */}
            <Route path="/login" element={<Login />} />

            {/* MainLayout va nested route’lar uchun protected route */}
           // AppRoutes.js
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                {/* Dashboard */}
                <Route index element={<Dashboard />} />          {/* "/" */}
                <Route path="dashboard" element={<Dashboard />} />  {/* "/dashboard" */}
                <Route
                    path="students"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "teacher", "superadmin"]}>
                            <Students />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="teachers"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                            <Teachers />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admins"
                    element={
                        <ProtectedRoute allowedRoles={["superadmin"]}>
                            <Admins />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="groups"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                            {/* Groups component */}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="attendance"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "teacher", "superadmin"]}>
                            {/* Attendance component */}
                        </ProtectedRoute>
                    }
                />
            </Route>


            {/* Not found */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
