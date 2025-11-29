import axiosInstance from "../api/axiosConfig";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNotification } from "../components/Notification";
import { AnimatePresence, motion } from "framer-motion";

export default function TeacherGroups() {
    const { id } = useParams();
    const { show } = useNotification();

    const [teacher, setTeacher] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [newGroup, setNewGroup] = useState({
        name: "",
        subject: "",
        time: "",
    });

    // Form state (modal inputs)
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [editMode, setEditMode] = useState(false);

    // Fetch teacher & groups
    const fetchTeacher = async () => {
        try {
            const res = await axiosInstance.get(`/teachers/${id}`);
            setTeacher(res.data.teacher);
            setGroups(res.data.group || []);
        } catch (err) {
            show({ type: "error", message: "Teacherni yuklab bo‘lmadi!" });
        } finally {
            setLoading(false);
        }
    };

    // Create group
    const handleCreateGroup = async () => {
        try {
            const res = await axiosInstance.post("/groups", {
                ...newGroup,
                teacherId: id,
            });

            show({ type: "success", message: "Guruh yaratildi!" });

            setGroups(prev => [...prev, res.data.group]);

            setShowModal(false);
            setNewGroup({ name: "", subject: "", time: "" });
        } catch (err) {
            show({ type: "error", message: "Guruh yaratib bo‘lmadi!" });
        }
    };

    // Example modal save handler (Admin)
    const handleSave = () => {
        show({ type: "success", message: editMode ? "Admin tahrirlandi" : "Admin yaratildi" });
        setShowModal(false);
        setForm({ name: "", email: "", password: "" });
    };

    useEffect(() => {
        fetchTeacher();
    }, [id]);

    if (loading) return <p className="p-6">Yuklanmoqda...</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto mt-16">
            {/* Teacher Header */}
            <div className="flex gap-4 items-center mb-6">
                <img
                    className="w-20 h-20 rounded-full object-cover border dark:border-gray-700"
                    src={teacher?.avatar}
                    alt={teacher?.fullName}
                />
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                    {teacher?.fullName}
                </h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
                >
                    + Yangi guruh
                </button>
            </div>

            {/* Groups */}
            {groups?.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center mt-32">
                    Hozircha guruh mavjud emas
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <div
                            key={group._id}
                            className="bg-white dark:bg-gray-900 border dark:border-gray-700 shadow rounded-xl p-5"
                        >
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                {group.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">Fan: {group.subject}</p>
                            <p className="text-gray-600 dark:text-gray-300">Vaqt: {group.time}</p>
                            <p className="text-gray-600 dark:text-gray-300">
                                O‘quvchilar: {group.students?.length || 0}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {groups.map(group => (
                            <motion.div
                                key={group._id}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl
                       border border-white/60 dark:border-white/10
                       shadow-lg shadow-black/5 dark:shadow-white/5
                       rounded-2xl p-6 cursor-pointer
                       hover:shadow-2xl hover:shadow-green-500/20
                       transition-all"
                            >
                                {/* Title */}
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {group.name}
                                </h2>

                                {/* Subject */}
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-gray-200">Fan: </span>
                                    {group.subject}
                                </p>

                                {/* Time */}
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-gray-200">Vaqt: </span>
                                    {group.time}
                                </p>

                                {/* Students */}
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium text-gray-900 dark:text-gray-200">O‘quvchilar:</span>
                                        {" "}{group.students?.length || 0}
                                    </p>

                                    {/* Badge */}
                                    <span className="
                    px-3 py-1 text-sm rounded-full
                    bg-green-600/20 text-green-700
                    dark:bg-green-500/20 dark:text-green-300
                    border border-green-600/30 dark:border-green-500/30
                ">
                                        {group.students?.length || 0} ta
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                )}
            </AnimatePresence>

        </div>
    );
}
