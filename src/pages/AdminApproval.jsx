import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function AdminApproval() {
    const [pendingAdmins, setPendingAdmins] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user || user.role !== "admin") return;

        api.get("/admin/pending").then(res => setPendingAdmins(res.data));
    }, [user]);

    const handleApprove = async (id) => {
        await api.put(`/admin/approve/${id}`);
        setPendingAdmins(prev => prev.filter(admin => admin._id !== id));
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Pending Admins</h1>
            {pendingAdmins.length === 0 && <p>Hozircha tasdiqlanishi kerak bo‘lgan admin yo‘q.</p>}
            <ul>
                {pendingAdmins.map(admin => (
                    <li key={admin._id} className="mb-2 flex items-center justify-between border p-2 rounded">
                        <span>{admin.fullName} (@{admin.username})</span>
                        <button
                            onClick={() => handleApprove(admin._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                            Approve
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
