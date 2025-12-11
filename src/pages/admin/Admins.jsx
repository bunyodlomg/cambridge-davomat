import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../../components/Notification";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function Admins() {
    const { show } = useNotification();

    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        approved: true,
    });

    // ================= GET ADMINS =================
    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admins");
            setAdmins(res.data);
        } catch (err) {
            show({ type: "error", message: "Adminlarni yuklab bo‘lmadi!" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // ================= OPEN MODALS =================
    const openCreate = () => {
        setEditMode(false);
        setForm({ name: "", email: "", password: "", approved: true });
        setModalOpen(true);
    };

    const openEdit = (admin) => {
        setEditMode(true);
        setForm({ ...admin, password: "" }); // Password yangilanmasa eski qoladi
        setModalOpen(true);
    };

    // ================= CREATE / UPDATE =================
    const handleSave = async () => {
        if (!form.name || !form.email || (!editMode && !form.password)) {
            show({ type: "warning", message: "Barcha maydonlarni to‘ldiring!" });
            return;
        }

        try {
            if (editMode) {
                await axiosInstance.put(`/admins/${form._id}`, form);
                show({ type: "success", message: "Admin yangilandi!" });
            } else {
                await axiosInstance.post("/admins", form);
                show({ type: "success", message: "Admin qo‘shildi!" });
            }

            setModalOpen(false);
            fetchAdmins();
        } catch (err) {
            console.error(err.response?.data || err.message);
            show({ type: "error", message: "Saqlashda xatolik!" });
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        if (!window.confirm("Adminni o‘chirishni xohlaysizmi?")) return;

        try {
            await axiosInstance.delete(`/admins/${id}`);
            show({ type: "success", message: "Admin o‘chirildi!" });
            fetchAdmins();
        } catch {
            show({ type: "error", message: "O‘chirib bo‘lmadi!" });
        }
    };

    // ================= TOGGLE =================
    const toggleActive = async (id) => {
        try {
            await axiosInstance.put(`/admins/${id}/toggle`);
            show({ type: "success", message: "Status o‘zgartirildi!" });
            fetchAdmins();
        } catch {
            show({ type: "error", message: "Statusni o‘zgartirib bo‘lmadi!" });
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between mb-6 items-center mt-10">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Adminlar</h1>

                <button
                    className="px-5 py-2 rounded-xl bg-red-600 text-white shadow hover:bg-red-700 transition active:scale-95"
                    onClick={openCreate}
                >
                    + Yangi Admin
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-2xl p-5">
                <table className="w-full text-gray-800 dark:text-gray-200">
                    <thead>
                        <tr className="border-b border-gray-300 dark:border-gray-700 font-medium">
                            <th className="p-3 text-left">Ism</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((a) => (
                            <tr
                                key={a._id}
                                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                            >
                                <td className="p-3">{a.name}</td>
                                <td className="p-3">{a.email}</td>
                                <td className="p-3">
                                    {a.approved ? (
                                        <span className="text-green-500 font-medium">Faol</span>
                                    ) : (
                                        <span className="text-red-500 font-medium">Nofaol</span>
                                    )}
                                </td>
                                <td className="p-3 flex gap-4 text-xl">
                                    <button
                                        onClick={() => toggleActive(a._id)}
                                        className={`transition
                                        ${a.approved ? 'text-blue-500 hover:text-blue-700' : 'text-red-500 hover:text-red-700'}`}
                                    >
                                        {a.approved ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>

                                    <button
                                        className="text-blue-500 hover:text-blue-700 transition"
                                        onClick={() => openEdit(a)}
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        className="text-red-500 hover:text-red-700 transition"
                                        onClick={() => handleDelete(a._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="backdrop-blur-2xl bg-none dark:bg-gray-800 border border-gray-100 dark:border-gray-500 shadow-2xl rounded-2xl p-6 w-[420px]"
                        >
                            <h2 className="text-2xl mb-4 font-semibold text-gray-800 dark:text-gray-100">
                                {editMode ? "Adminni tahrirlash" : "Yangi Admin"}
                            </h2>

                            <div className="flex flex-col gap-4">
                                <input
                                    className="w-full px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                                       border border-gray-100 dark:border-gray-700 shadow-sm 
                                       focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    placeholder="To‘liq ism"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />

                                <input
                                    className="w-full px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                                       border border-gray-100 dark:border-gray-700 shadow-sm 
                                       focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />

                                <input
                                    type="password"
                                    className="w-full px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                                       border border-gray-100 dark:border-gray-700 shadow-sm 
                                       focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    placeholder={editMode ? "Yangi parol (ixtiyoriy)" : "Parol"}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-500 
                                       text-gray-700 dark:text-gray-200 
                                       border border-gray-300 dark:border-gray-700 shadow-sm 
                                       hover:bg-gray-300 dark:hover:bg-[#444] transition"
                                >
                                    Bekor qilish
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2 rounded-xl shadow-2xl shadow-red-500 bg-red-600 text-white hover:bg-red-700 transition"
                                >
                                    Saqlash
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
}
