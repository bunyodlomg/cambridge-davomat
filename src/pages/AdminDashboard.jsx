import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";


export default function AdminDashboard() {
    const { logout } = useContext(AuthContext);
    const [pendingUsers, setPendingUsers] = useState([]);

    const fetchPendingUsers = async () => {
        try {
            const res = await api.get("/admin/pending-users");
            setPendingUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const approveUser = async (id) => {
        try {
            await api.post(`/admin/approve-user/${id}`);
            fetchPendingUsers();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <button
                onClick={logout}
                className="mb-4 px-4 py-2 bg-red-600 text-white rounded"
            >
                Logout
            </button>

            <h2 className="text-xl font-semibold mb-2">Pending Users</h2>
            <ul>
                {pendingUsers.map((user) => (
                    <li key={user._id} className="flex justify-between mb-2 border p-2 rounded">
                        <span>{user.fullName} ({user.role})</span>
                        <button
                            onClick={() => approveUser(user._id)}
                            className="px-2 py-1 bg-green-600 text-white rounded"
                        >
                            Approve
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
