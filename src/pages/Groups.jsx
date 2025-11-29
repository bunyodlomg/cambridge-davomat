import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { useNotification } from "../components/Notification";
import { motion } from "framer-motion";

export default function Groups() {
    const { show } = useNotification();
    const [teachers, setTeachers] = useState([]);
    const navigate = useNavigate();

    const fetchTeachers = async () => {
        try {
            const res = await axiosInstance.get("/teachers");
            const approvedTeachers = res.data.filter(t => t.approved);
            setTeachers(approvedTeachers);
        } catch (err) {
            show({ type: "error", message: "O‘qituvchilarni yuklab bo‘lmadi!" });
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto mt-16">
            <h1 className="text-3xl font-semibold mb-6">O‘qituvchilar</h1>

            <div className="grid gap-6 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      lg:grid-cols-4">

                {teachers.map(t => (
                    <div
                        key={t._id}
                        onClick={() => navigate(`/teacher/${t._id}`)}
                        className="
                        bg-white dark:bg-gray-900 shadow-xl 
                        rounded-2xl p-4 cursor-pointer w-full
                        transform transition-all duration-300 
                        hover:scale-105 hover:shadow-2xl 
                        overflow-hidden
                    "
                    >
                        <div className="flex items-center gap-3 mb-3">
                            {t.avatar ? (
                                <img
                                    src={t.avatar}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-white">
                                    <FaUserTie size={28} />
                                </div>
                            )}

                            <div className="w-[70%]">
                                <h2 className="
                            text-lg font-semibold 
                            whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                    {t.fullName}
                                </h2>

                                <a className="
                            text-gray-500 dark:text-gray-400 
                            whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                    {t.phone}
                                </a>
                            </div>
                        </div>

                        <p className="
          text-gray-700 dark:text-gray-300 
          whitespace-nowrap overflow-hidden text-ellipsis
        ">
                            Fan: {t.subject}
                        </p>
                    </div>
                ))}
            </div>
        </div>

    );
}
