import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { FaCheckCircle, FaToggleOn } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { useNotification } from "../components/Notification";

export default function Teachers() {
    const { show } = useNotification();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("unapproved"); // "unapproved" yoki "approved"

    // ================= GET TEACHERS =================
    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/teachers"); // barcha teacherlar
            setTeachers(res.data);
        } catch {
            show({ type: "error", message: "O‘qituvchilarni yuklab bo‘lmadi!" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // ================= APPROVE TEACHER =================
    const approveTeacher = async (userId) => {
        try {
            await axiosInstance.post("/teachers/approve", { userId });
            show({ type: "success", message: "O‘qituvchi tasdiqlandi!" });
            fetchTeachers(); // ro‘yxatni yangilash
        } catch {
            show({ type: "error", message: "Tasdiqlashda xatolik yuz berdi!" });
        }
    };

    // ================= AJRATISH =================
    const approvedTeachers = teachers.filter(t => t.approved);
    const unapprovedTeachers = teachers.filter(t => !t.approved);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                O‘qituvchilar
            </h1>

            {/* TAB BUTTONS */}
            <div className="flex gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-xl font-medium transition ${activeTab === "unapproved"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                    onClick={() => setActiveTab("unapproved")}
                >
                    Tasdiqlanishi kerak
                </button>

                <button
                    className={`px-4 py-2 rounded-xl font-medium transition ${activeTab === "approved"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                    onClick={() => setActiveTab("approved")}
                >
                    Tasdiqlangan
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-2xl p-5 overflow-x-auto">
                <table className="w-full text-gray-800 dark:text-gray-200">
                    <thead>
                        <tr className="border-b border-gray-300 dark:border-gray-700 font-medium">
                            <th className="p-3 text-left">Ism</th>
                            <th className="p-3 text-left">Fan</th>
                            <th className="p-3 text-left">Telefon</th>
                            <th className="p-3 text-left">Telegram ID</th>
                            <th className="p-3 text-left">Username</th>
                            <th className="p-3 text-left">Avatar</th>
                            <th className="p-3 text-left">Status</th>
                            {activeTab === "unapproved" && <th className="p-3 text-left">Amallar</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {(activeTab === "unapproved" ? unapprovedTeachers : approvedTeachers).map((t) => (
                            <tr
                                key={t._id}
                                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                            >
                                <td className="p-3">{t.fullName}</td>
                                <td className="p-3">{t.subject || "—"}</td>
                                <td className="p-3">{t.phone || "—"}</td>
                                <td className="p-3">{t.telegramId || "—"}</td>
                                <td className="p-3">{t.username || "—"}</td>
                                <td className="p-3">
                                    {t.avatar ? (
                                        <img src={t.avatar} alt={t.fullName} className="w-12 h-12 rounded-full" />
                                    ) : (
                                        "—"
                                    )}
                                </td>
                                <td className="p-3">
                                    {t.approved ? (
                                        <span className="text-green-500 font-medium">
                                            <FaCheckCircle /> Tasdiqlangan
                                        </span>
                                    ) : (
                                        <span className="text-red-500 font-medium">
                                            <CgDanger /> Kutilmoqda
                                        </span>
                                    )}
                                </td>
                                {activeTab === "unapproved" && (
                                    <td className="p-3 flex gap-4 text-xl">
                                        <button
                                            className="text-green-500 hover:text-green-700 transition"
                                            onClick={() => approveTeacher(t._id)}
                                        >
                                            <FaToggleOn />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
