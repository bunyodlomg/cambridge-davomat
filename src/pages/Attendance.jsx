import React from "react";

import { useState, useEffect } from "react";
import Table from "../components/Table";
import axios from "axios";

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Columnlar (Table komponenti uchun)
    const columns = ["Student", "Class", "Group", "Status", "Time"];

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await axios.get("/api/attendance"); // backend route
                setAttendanceData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();

        // TODO: real-time Socket.IO listener
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Attendance</h1>

            <div className="bg-white rounded-2xl shadow-md p-6">
                {loading ? (
                    <p className="text-gray-500 text-center py-20">Loading attendance data...</p>
                ) : attendanceData.length === 0 ? (
                    <p className="text-gray-500 text-center py-20">No attendance records yet.</p>
                ) : (
                    <Table columns={columns} data={attendanceData.map((item) => ({
                        Student: item.studentName,
                        Class: item.className,
                        Group: item.groupName,
                        Status: item.status ? "Present" : "Absent",
                        Time: new Date(item.time).toLocaleTimeString(),
                    }))} />
                )}
            </div>
        </div>
    );
};

export default Attendance;
