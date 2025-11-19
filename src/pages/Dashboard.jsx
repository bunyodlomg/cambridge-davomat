import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <p>Loading...</p>; // yoki Redirect / Login page
    }

    return (
        <div>
            <h1>Welcome, {user?.fullName || "Guest"}!</h1>
        </div>
    );
}
