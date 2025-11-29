import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { useNotification } from "../components/Notification";
import { AnimatePresence, motion } from "framer-motion";
import { MdDelete, MdEdit } from "react-icons/md";

export default function TeachersApproved() {
    const { show } = useNotification();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("unapproved");
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({
        fullName: "",
        subject: "",
        phone: ""
    });

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/teachers");
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


    const handleApprove = async (id) => {
        try {
            await axiosInstance.put(`/teachers/${id}`, { approved: true });

            setTeachers(prev =>
                prev.map(t =>
                    t._id === id ? { ...t, approved: true } : t
                )
            );

            show({ type: "success", message: "O‘qituvchi tasdiqlandi!" });
        } catch (err) {
            show({ type: "error", message: "Tasdiqlashda xatolik!" });
        }
    };

    const openEdit = (teacher) => {
        setEditData({
            _id: teacher._id,
            fullName: teacher.fullName || "",
            subject: teacher.subject || "",
            phone: teacher.phone || "",
        });
        setEditModal(true);
    };

    const deleteTeacher = async () => {
        if (!selectedTeacher) return;

        try {
            await axiosInstance.delete(`/teachers/${selectedTeacher._id}`);

            setTeachers(prev => prev.filter(t => t._id !== selectedTeacher._id));

            show({ type: "success", message: "O‘qituvchi o‘chirildi!" });
        } catch (err) {
            show({ type: "error", message: "O‘chirishda xatolik!" });
        } finally {
            setDeleteModal(false);
            setSelectedTeacher(null);
        }
    };





    const updateTeacher = async () => {
        try {
            await axiosInstance.put(`/teachers/${editData._id}`, {
                fullName: editData.fullName,
                subject: editData.subject,
                phone: editData.phone,
            });

            show({ type: "success", message: "O‘qituvchi yangilandi!" });
            setEditModal(false);
            fetchTeachers();
        } catch {
            show({ type: "error", message: "Yangilashda xatolik!" });
        }
    };

    const approvedTeachers = teachers.filter(t => t.approved);
    const unapprovedTeachers = teachers.filter(t => !t.approved);

    return (
        <div className="p-6">
            <h1 className="text-3xl dark:text-white font-semibold mb-6 mt-16">
                O‘qituvchilar
            </h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    className={`relative px-5 py-2 rounded-xl font-medium transition ${activeTab === "unapproved"
                            ? "bg-red-700 text-white dark:bg-red-600"
                            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                    onClick={() => setActiveTab("unapproved")}
                >
                    Tasdiqlanishi kerak
                    <div className="absolute -top-2 -right-2 px-2 py-0 rounded-xl bg-orange-400">
                        {unapprovedTeachers.length}
                    </div>
                </button>

                <button
                    className={`relative px-5 py-2 rounded-xl font-medium transition ${activeTab === "approved"
                            ? "bg-green-700 text-white dark:bg-green-600"
                            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                    onClick={() => setActiveTab("approved")}
                >
                    Tasdiqlangan
                    <div className="absolute -top-2 -right-2 px-2 py-0 rounded-xl bg-orange-400">
                        {approvedTeachers.length}
                    </div>
                </button>
            </div>


            {/* Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-xl rounded-2xl p-5 overflow-x-auto">
                <table className="w-full text-gray-800 dark:text-gray-200">
                    <thead>
                        <tr className="border-b border-gray-300 dark:border-gray-700 font-medium text-left">
                            <th className="p-3">Ism</th>
                            <th className="p-3">Fan</th>
                            <th className="p-3">Telefon</th>
                            <th className="p-3">Username</th>
                            <th className="p-3 text-center">Amallar</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(activeTab === "unapproved" ? unapprovedTeachers : approvedTeachers).map(t => (
                            <tr
                                key={t._id}
                                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                {/* Avatar + Name */}
                                <td className="p-3 flex items-center gap-3 font-semibold">
                                    {t.avatar ? (
                                        <img
                                            src={t.avatar}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-400" />
                                    )}
                                    <span>{t.fullName || "—"}</span>
                                </td>

                                <td className="p-3">{t.subject || "—"}</td>
                                <td className="p-3">{t.phone || "—"}</td>

                                <td className="p-3">
                                    {t.username ? (
                                        <a
                                            className="text-blue-600 hover:underline"
                                            target="_blank"
                                            href={`https://t.me/${t.username}`}
                                        >
                                            @{t.username}
                                        </a>
                                    ) : "—"}
                                </td>

                                {/* Actions */}
                                <td className="text-center gap-3">
                                    {activeTab === "unapproved" && (
                                        <>
                                            {/* Qabul qilish */}
                                            <button
                                                className="px-3 py-1 rounded-full bg-green-600 text-white hover:bg-green-700 transition mr-2"
                                                onClick={() => handleApprove(t._id)}
                                            >
                                                <FaCheckCircle />
                                            </button>
                                        </>
                                    )}

                                    {activeTab === "approved" && (
                                        <button
                                            className="px-3 py-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition mr-3"
                                            onClick={() => openEdit(t)}
                                        >
                                            <MdEdit />
                                        </button>
                                    )}
                                    <button
                                        className="px-3 py-1 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                                        onClick={() => {
                                            setSelectedTeacher(t);
                                            setDeleteModal(true);
                                        }}
                                    >
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {editModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="backdrop-blur-2xl border bg-black/10 dark:bg-gray-900/10 border-gray-100 dark:border-gray-800 shadow-2xl rounded-2xl p-6 w-[420px]"
                        >
                            <h2 className="text-2xl mb-5 font-semibold text-gray-800 dark:text-gray-100">
                                O‘qituvchini tahrirlash
                            </h2>

                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-xl bg-white/20 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 
                           border border-gray-200 dark:border-gray-600 shadow-sm
                           focus:ring-2 focus:ring-white dark:focus:ring-gray-600 outline-none"
                                    placeholder="Ism Familiya"
                                    value={editData.fullName}
                                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                />

                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-xl bg-white/20 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 
                           border border-gray-200 dark:border-gray-600 shadow-sm
                           focus:ring-2 focus:ring-white dark:focus:ring-gray-600 outline-none"
                                    placeholder="Fan"
                                    value={editData.subject}
                                    onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                                />

                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-xl bg-white/20 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 
                           border border-gray-200 dark:border-gray-600 shadow-sm
                           focus:ring-2 focus:ring-white dark:focus:ring-gray-600 outline-none"
                                    placeholder="Telefon"
                                    value={editData.phone}
                                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setEditModal(false)}
                                    className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-gray-200 
                           border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                >
                                    Bekor
                                </button>

                                <button
                                    onClick={updateTeacher}
                                    className="px-5 py-2 rounded-xl shadow-2xl shadow-blue-500 bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Saqlash
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}


                {deleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-xl rounded-2xl p-6 w-[400px]"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                                O‘chirishni tasdiqlaysizmi?
                            </h2>

                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                <span className="font-semibold">{selectedTeacher?.fullName}</span>
                                ni o‘chirmoqchimisiz?
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteModal(false)}
                                    className="px-5 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                >
                                    Bekor qilish
                                </button>

                                <button
                                    onClick={deleteTeacher}
                                    className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                                >
                                    Ha, o‘chirilsin
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>



        </div>
    );
}
