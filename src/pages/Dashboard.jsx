import React, { useContext } from "react";

import Card from "../components/Card";
import { FaUserGraduate, FaChalkboardTeacher, FaLayerGroup } from "react-icons/fa";

const Dashboard = () => {
    const stats = [
        { title: "Students", value: 120, icon: <FaUserGraduate /> },
        { title: "Teachers", value: 15, icon: <FaChalkboardTeacher /> },
        { title: "Groups", value: 25, icon: <FaLayerGroup /> },
    ];


    return (
        <div className='p-10 text-gray-900 dark:text-white mt-10 transition-all'>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} title={stat.title} value={stat.value} icon={stat.icon} />
                ))}
            </div>
            <div className="mt-10 bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Attendance</h2>
                <p className="text-gray-500">Attendance table will go here</p>
            </div>
        </div>
    );
};

export default Dashboard;
