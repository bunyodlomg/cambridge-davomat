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
        <div className="p-6">
            <h1 className="text-3xl dark:text-white font-semibold mb-6 mt-10">
                O‘qituvchilar
            </h1>

            <div
                className="
                    grid gap-5
                    grid-cols-1
                    xs:grid-cols-2
                    sm:grid-cols-2 
                    md:grid-cols-1 
                    lg:grid-cols-2
                    xl:grid-cols-3
                "
            >
                {teachers.map(t => (
                    <motion.div
                        key={t._id}
                        onClick={() => navigate(`/teacher/${t._id}`)}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.25 }}
                        className="
                            bg-white dark:bg-gray-900 
                            shadow-lg dark:shadow-gray-800 
                            rounded-2xl p-4 
                            cursor-pointer w-full
                            transform transition-all duration-300
                            hover:shadow-2xl
                            border border-gray-200 dark:border-gray-700
                        "
                    >
                        <div className="flex items-center gap-4 mb-3">
                            {t.avatar ? (
                                <img
                                    src={t.avatar}
                                    className="w-16 h-16 rounded-full object-cover shadow-md"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-white shadow-md">
                                    <FaUserTie size={30} />
                                </div>
                            )}

                            <div className="w-[70%]">
                                <h2 className="
                                    text-lg sm:text-xl 
                                    font-semibold 
                                    dark:text-white
                                    whitespace-nowrap overflow-hidden text-ellipsis
                                ">
                                    {t.fullName}
                                </h2>

                                <p className="
                                    text-gray-600 dark:text-gray-300
                                    text-sm sm:text-base
                                    whitespace-nowrap overflow-hidden text-ellipsis
                                ">
                                    {t.phone}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {t.subjects?.map((s, index) => (
                                <span
                                    key={index}
                                    className="
                                        text-xs sm:text-sm font-bold
                                        bg-red-100 dark:bg-red-800 
                                        text-red-700 dark:text-red-200
                                        px-2 py-1 rounded-lg
                                    "
                                >
                                    {s}
                                </span>
                            ))}
                        </div>

                    </motion.div>
                ))}
            </div>
        </div>
    );
}
