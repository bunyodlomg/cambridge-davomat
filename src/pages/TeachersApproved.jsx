import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { FaCheckCircle } from "react-icons/fa";
import { useNotification } from "../components/Notification";
import { AnimatePresence, motion } from "framer-motion";
import { MdDelete, MdEdit } from "react-icons/md";
// ...importlar o‘sha kabi qoladi

export default function TeachersApproved() {
    const { show } = useNotification();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("approved");
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [editModal, setEditModal] = useState(false);

    const [editData, setEditData] = useState({
        _id: "",
        fullName: "",
        subjects: [],
        phone: "",
        newSubject: "", // input orqali yangi fan
        class: "",
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
            setTeachers(prev => prev.map(t => (t._id === id ? { ...t, approved: true } : t)));
            show({ type: "success", message: "O‘qituvchi tasdiqlandi!" });
        } catch {
            show({ type: "error", message: "Tasdiqlashda xatolik!" });
        }
    };

    const openEdit = (teacher) => {
        setEditData({
            _id: teacher._id,
            fullName: teacher.fullName || "",
            phone: teacher.phone || "",
            subjects: Array.isArray(teacher.subjects) ? teacher.subjects : [],
            newSubject: "",
            class: teacher.class || "",
        });
        setEditModal(true);
    };

    // Yangi fan qo‘shish (input orqali)
    const addSubject = () => {
        if (!editData.newSubject.trim()) return;
        setEditData(prev => ({
            ...prev,
            subjects: [...prev.subjects, prev.newSubject.trim()],
            newSubject: ""
        }));
    };

    const removeSubject = (index) => {
        setEditData(prev => ({
            ...prev,
            subjects: prev.subjects.filter((_, i) => i !== index)
        }));
    };

    const updateTeacher = async () => {
        try {
            await axiosInstance.put(`/teachers/${editData._id}`, {
                fullName: editData.fullName,
                phone: editData.phone,
                subjects: editData.subjects,
                class: editData.class,
            });
            show({ type: "success", message: "O‘qituvchi yangilandi!" });
            setEditModal(false);
            fetchTeachers();
        } catch {
            show({ type: "error", message: "Yangilashda xatolik!" });
        }
    };

    const deleteTeacher = async () => {
        if (!selectedTeacher) return;
        try {
            await axiosInstance.delete(`/teachers/${selectedTeacher._id}`);
            setTeachers(prev => prev.filter(t => t._id !== selectedTeacher._id));
            show({ type: "success", message: "O‘qituvchi o‘chirildi!" });
        } catch {
            show({ type: "error", message: "O‘chirishda xatolik!" });
        } finally {
            setDeleteModal(false);
            setSelectedTeacher(null);
        }
    };

    const approvedTeachers = teachers.filter(t => t.approved);
    const unapprovedTeachers = teachers.filter(t => !t.approved);

    return (
        <div className="p-6">
            <h1 className="text-3xl dark:text-white font-semibold mb-6 mt-10">
                O‘qituvchilar
            </h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    className={`relative px-5 py-2 rounded-xl font-medium transition ${activeTab === "unapproved"
                        ? "bg-red-700 text-white"
                        : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
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
                        ? "bg-green-700 text-white"
                        : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
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
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-2xl p-5">

                {/* Responsive wrapper */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[700px] text-gray-800 dark:text-gray-200">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 font-medium text-left">
                                <th className="p-3">Ism</th>
                                <th className="p-3">Fanlar</th>
                                <th className="p-3">Telefon</th>
                                <th className="p-3">Username</th>
                                <th className="p-3">Sinf</th>
                                <th className="p-3 text-center">Amallar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(activeTab === "unapproved" ? unapprovedTeachers : approvedTeachers).map(t => (
                                <tr key={t._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
                                    <td className="p-3 font-semibold flex items-center gap-3">
                                        <img className="rounded-full w-10 h-10" src={t.avatar} alt={t.fullName} />
                                        {t.fullName}
                                    </td>

                                    <td className="p-3">
                                        {Array.isArray(t.subjects) && t.subjects.length > 0 ? (
                                            t.subjects.map((sub, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md text-xs font-medium mr-1 mb-1"
                                                >
                                                    {sub}
                                                </span>
                                            ))
                                        ) : "—"}
                                    </td>

                                    <td className="p-3">
                                        <a href={`tel:${t.phone}`}>{t.phone || "—"}</a>
                                    </td>

                                    <td className="p-3">
                                        {t.username ? (
                                            <a className="text-blue-600" target="_blank" href={`https://t.me/${t.username}`}>@{t.username}</a>
                                        ) : "—"}
                                    </td>
                                    <td className="p-3 font-semibold gap-3">
                                        {t.class ? t.class : "—"}
                                    </td>
                                    <td className="p-3 flex justify-center items-center">
                                        {activeTab === "unapproved" && (
                                            <button className="px-3 py-1 rounded-full bg-green-600 text-white mr-3"
                                                onClick={() => handleApprove(t._id)}>
                                                <FaCheckCircle />
                                            </button>
                                        )}

                                        {activeTab === "approved" && (
                                            <button className="px-3 py-1 rounded-xl bg-blue-600 text-white mr-3"
                                                onClick={() => openEdit(t)}>
                                                <MdEdit />
                                            </button>
                                        )}

                                        <button className="px-3 py-1 rounded-xl bg-red-600 text-white"
                                            onClick={() => { setSelectedTeacher(t); setDeleteModal(true); }}>
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* EDIT MODAL */}
            <AnimatePresence>
                {editModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="backdrop-blur-2xl bg-none dark:bg-gray-800 border border-gray-100 dark:border-gray-500 shadow-2xl rounded-2xl p-6 w-full max-w-lg"
                        >
                            <h2 className="text-2xl mb-4 font-semibold text-gray-800 dark:text-gray-100 text-center">
                                O‘qituvchini tahrirlash
                            </h2>

                            {/* Full Name */}
                            <input
                                type="text"
                                placeholder="Ism familiya"
                                value={editData.fullName}
                                onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                                className="w-full px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none mb-3"
                            />

                            {/* Phone */}
                            <input
                                type="text"
                                placeholder="Telefon"
                                value={editData.phone}
                                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none mb-3"
                            />

                            {/* Subjects input */}
                            <div className="mb-4">
                                <label className="font-semibold dark:text-white">Fanlar:</label>
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Fan nomi"
                                        value={editData.newSubject}
                                        onChange={(e) => setEditData(prev => ({ ...prev, newSubject: e.target.value }))}
                                        onKeyDown={(e) => { if (e.key === 'Enter') addSubject(); }}
                                        className="w-1/2 px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    />
                                    <button
                                        className="px-3 py-2 bg-red-600 text-white rounded-xl"
                                        onClick={addSubject}
                                    >
                                        Qo‘shish
                                    </button>
                                </div>

                                {/* Inline fanlar ro‘yxati (editable) */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {editData.subjects.map((subj, index) => (
                                        <div key={index} className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                                            {editData.editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    value={editData.subjects[index]}
                                                    autoFocus
                                                    onChange={(e) => {
                                                        const newSubjects = [...editData.subjects];
                                                        newSubjects[index] = e.target.value;
                                                        setEditData(prev => ({ ...prev, subjects: newSubjects }));
                                                    }}
                                                    onBlur={() => setEditData(prev => ({ ...prev, editingIndex: null }))}
                                                    onKeyDown={(e) => { if (e.key === "Enter") setEditData(prev => ({ ...prev, editingIndex: null })); }}
                                                    className="px-2 py-1 rounded-full text-sm w-[80px]"
                                                />
                                            ) : (
                                                <span
                                                    className="text-gray-800 dark:text-gray-200"
                                                    onClick={() => setEditData(prev => ({ ...prev, editingIndex: index }))}
                                                >
                                                    {subj}
                                                </span>
                                            )}
                                            <button
                                                className="p-1 text-red-600 rounded-full transition"
                                                onClick={() => removeSubject(index)}
                                            >
                                                <MdDelete size={18} className="hover:scale-110" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                            </div>


                            {/* Buttons */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-300 dark:hover:bg-[#444] transition"
                                    onClick={() => setEditModal(false)}>Bekor qilish</button>
                                <button className="px-5 py-2 rounded-xl shadow-2xl shadow-red-500 bg-red-600 text-white hover:bg-red-700 transition"
                                    onClick={updateTeacher}>Saqlash</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DELETE MODAL */}
            <AnimatePresence>
                {deleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="backdrop-blur-2xl bg-none dark:bg-gray-800 border border-gray-100 dark:border-gray-500 shadow-2xl rounded-2xl p-6 w-full max-w-md"
                        >
                            <h2 className="text-xl font-semibold mb-4 dark:text-white text-center">
                                O‘chirishni tasdiqlaysizmi?
                            </h2>

                            <div className="flex justify-end gap-3 mt-4">
                                <button className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-300 dark:hover:bg-[#444] transition"
                                    onClick={() => setDeleteModal(false)}>Bekor qilish</button>
                                <button className="px-5 py-2 rounded-xl shadow-2xl shadow-red-500 bg-red-600 text-white hover:bg-red-700 transition"
                                    onClick={deleteTeacher}>O‘chirish</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
