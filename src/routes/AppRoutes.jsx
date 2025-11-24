import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import Groups from "../pages/Groups";
import Attendance from "../pages/Attendance";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => (
    <Routes>
        <Route path="/login" element={<Login />} />

        <Route
            path="/"
            element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }
        >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="groups" element={<Groups />} />
            <Route path="attendance" element={<Attendance />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
);

export default AppRoutes;
