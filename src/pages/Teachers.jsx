import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axiosInstance from "../api/axiosConfig";
import { AnimatePresence, motion } from "framer-motion";

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);

    const [form, setForm] = useState({
        name: "",
        subject: "",
        time: "",
        teacherId: "",
    });

    // 📌 TEACHERS & GROUPS LIST OLISH
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teacherRes, groupRes] = await Promise.all([
                    axiosInstance.get("/teachers"),
                    axiosInstance.get("/groups"),
                ]);

                setTeachers(teacherRes.data);
                setGroups(groupRes.data);
            } catch (err) {
                console.log("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 📌 GROUP QO‘SHISH / UPDATE
    const handleSaveGroup = async (e) => {
        e.preventDefault();
        try {
            if (editingGroup) {
                // UPDATE
                const res = await axiosInstance.put(`/groups/${editingGroup._id}`, form);
                setGroups(groups.map((g) => (g._id === res.data._id ? res.data : g)));
            } else {
                // CREATE
                const res = await axiosInstance.post("/groups", form);
                setGroups([...groups, res.data]);
            }
            setShowModal(false);
            setEditingGroup(null);
            setForm({ name: "", subject: "", time: "", teacherId: "" });
        } catch (err) {
            console.log("Error saving group:", err);
        }
    };

    // 📌 GROUP EDIT
    const handleEditGroup = (group) => {
        setEditingGroup(group);
        setForm({
            name: group.name,
            subject: group.subject,
            time: group.time,
            teacherId: group.teacher._id,
        });
        setShowModal(true);
    };

    // 📌 GROUP DELETE
    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Guruhni o‘chirilsinmi?")) return;
        try {
            await axiosInstance.delete(`/groups/${groupId}`);
            setGroups(groups.filter((g) => g._id !== groupId));
        } catch (err) {
            console.log("Error deleting group:", err);
        }
    };

    const columns = ["Name", "Subject", "Time", "Teacher", "Actions"];
    const tableData = groups.map((g) => ({
        name: g.name,
        subject: g.subject,
        time: g.time,
        teacher: g.teacher.fullName,
        actions: g,
    }));

    return (
        <div className="mt-16 p-6 transition-all duration-300 dark:bg-gray-900 min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
                    Groups
                </h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-green-600 text-white shadow-lg hover:bg-green-700 px-5 py-3 rounded-xl transition-all hover:scale-105"
                >
                    <FaPlus /> Add Group
                </button>
            </div>

            {/* TABLE */}
            <div className="rounded-2xl shadow-xl bg-white/70 dark:bg-white/10 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 transition-all">
                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-20">
                        Loading groups...
                    </p>
                ) : groups.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-20">
                        No groups found.
                    </p>
                ) : (
                    <Table
                        columns={columns}
                        data={tableData}
                        renderActions={(group) => (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditGroup(group)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteGroup(group._id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                    />
                )}
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="backdrop-blur-2xl bg-none dark:bg-gray-800 
                         border border-gray-100 dark:border-gray-500 
                         shadow-2xl rounded-2xl p-6 w-[420px]"
                        >
                            <h2 className="text-2xl mb-4 font-semibold text-gray-800 dark:text-gray-100">
                                {editingGroup ? "Edit Group" : "Add Group"}
                            </h2>

                            <form onSubmit={handleSaveGroup} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Group Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 
                             text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 
                             shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 
                             text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 
                             shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    required
                                />
                                <input
                                    type="time"
                                    placeholder="Time"
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 
                             text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 
                             shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    required
                                />
                                <select
                                    value={form.teacherId}
                                    onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-none backdrop-blur-3xl dark:bg-gray-700 
                             text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 
                             shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
                                    required
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map((t) => (
                                        <option key={t._id} value={t._id}>
                                            {t.fullName}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setShowModal(false); setEditingGroup(null); }}
                                        className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-500 
                               text-gray-700 dark:text-gray-200 
                               border border-gray-300 dark:border-gray-700 shadow-sm 
                               hover:bg-gray-300 dark:hover:bg-[#444] transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl shadow-2xl shadow-green-500 
                               bg-green-600 text-white hover:bg-green-700 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Teachers;
