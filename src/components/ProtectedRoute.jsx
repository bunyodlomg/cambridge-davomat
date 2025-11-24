import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <Loader />;  // hali auth holati yuklanmoqda
    if (!user) return <Navigate to="/login" replace />;  // login bo'lmasa loginga yuboradi

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // agar user role ruxsat etilganlar orasida bo'lmasa
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
