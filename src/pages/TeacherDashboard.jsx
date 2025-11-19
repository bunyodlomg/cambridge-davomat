import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

export default function TeacherDashboard() {
    const { user, logout } = useContext(AuthContext);
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        try {
            const res = await api.get("/teacher/students");
            setStudents(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
            <p className="mb-4">Welcome, {user.fullName}</p>
            <button
                onClick={logout}
                className="mb-4 px-4 py-2 bg-red-600 text-white rounded"
            >
                Logout
            </button>

            <h2 className="text-xl font-semibold mb-2">Students</h2>
            <ul>
                {students.map((student) => (
                    <li key={student._id} className="mb-2 border p-2 rounded">
                        {student.fullName} - {student.class}
                    </li>
                ))}
            </ul>
        </div>
    );
}
