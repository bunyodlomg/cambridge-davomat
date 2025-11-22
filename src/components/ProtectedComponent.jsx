import React,{ useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedComponent({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <Loader />; // Token tekshirilmoqda

    if (!user) return <div>Login qilishingiz kerak</div>;

    return children;
}
