import axiosInstance from "../../api/axiosConfig";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../Notification";
import { AnimatePresence } from "framer-motion";
import Loader from "../Loader";
import GroupModal from "./GroupModal";
import GroupCard from "./GroupCard";
import StatsCard from "./StatsCard";
import StudentAddModal from "../Students/StudentAddModal";
import { FaUserPlus } from "react-icons/fa";

export default function TeacherGroups() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { show } = useNotification();

    const [teacher, setTeacher] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allStudents, setAllStudents] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [newGroup, setNewGroup] = useState({
        name: "",
        subject: "",
        roomNumber: "",
        time: "",
        days: [],
    });

    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [subjects, setSubjects] = useState([]);
    const daysList = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];

    const fetchTeacher = async () => {
        try {
            const res = await axiosInstance.get(`/teachers/${id}`);
            setTeacher(res.data.teacher);
            setGroups(res.data.group || []);
            setSubjects(res.data.teacher?.subjects || []);
        } catch {
            show({ type: "error", message: "O'qituvchi ma'lumotlarini yuklab bo'lmadi!" });
        } finally {
            setLoading(false);
        }
    };

    const fetchAllStudents = async () => {
        try {
            const res = await axiosInstance.get("/students");
            setAllStudents(res.data);
        } catch (error) {
            console.error("Studentlarni yuklashda xatolik:", error);
            show({ type: "error", message: "Studentlarni yuklashda xatolik!" });
        }
    };

    useEffect(() => {
        fetchTeacher();
        fetchAllStudents();
    }, [id]);

    // Guruhdagi studentlarni to'liq ma'lumotlarini olish
    const getGroupStudents = (group) => {
        if (!group.students || !Array.isArray(group.students)) return [];

        if (group.students.length > 0 && typeof group.students[0] === 'string') {
            return group.students
                .map(studentId => allStudents.find(s => s._id === studentId))
                .filter(student => student !== undefined);
        }

        return group.students;
    };

    // Jami o'quvchilar sonini hisoblash
    const totalStudents = groups.reduce((total, group) => {
        const students = getGroupStudents(group);
        return total + students.length;
    }, 0);

    // O'rtacha o'quvchi sonini hisoblash
    const averageStudents = groups.length > 0 ? Math.round(totalStudents / groups.length) : 0;

    const handleSaveGroup = async () => {
        if (!newGroup.name || !newGroup.subject || !newGroup.time || !newGroup.roomNumber || newGroup.days.length === 0) {
            show({ type: "error", message: "Iltimos, barcha maydonlarni to'ldiring!" });
            return;
        }

        try {
            if (editingGroup) {
                const res = await axiosInstance.put(`/groups/${editingGroup._id}`, newGroup);
                setGroups(prev => prev.map(g => g._id === editingGroup._id ? res.data.group : g));
                show({ type: "success", message: "Guruh muvaffaqiyatli tahrirlandi!" });
            } else {
                const res = await axiosInstance.post("/groups", { ...newGroup, teacherId: id });
                setGroups(prev => [...prev, res.data.group]);
                show({ type: "success", message: "Yangi guruh muvaffaqiyatli yaratildi!" });
            }
            setShowModal(false);
            setEditingGroup(null);
            setNewGroup({ name: "", subject: "", roomNumber: "", time: "", days: [] });
        } catch (error) {
            console.error("Guruhni saqlashda xatolik:", error);
            show({
                type: "error",
                message: editingGroup
                    ? "Guruhni tahrirlashda xatolik yuz berdi!"
                    : "Guruh yaratishda xatolik yuz berdi!"
            });
        }
    };

    const handleEditGroup = (group) => {
        setEditingGroup(group);
        setNewGroup({
            name: group.name,
            subject: group.subject,
            roomNumber: group.roomNumber,
            time: group.time,
            days: group.days,
        });
        setShowModal(true);
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Bu guruhni o'chirishni tasdiqlaysizmi? Barcha o'quvchilar va davomat ma'lumotlari ham o'chiriladi!")) {
            return;
        }

        try {
            await axiosInstance.delete(`/groups/${groupId}`);
            setGroups(prev => prev.filter(g => g._id !== groupId));
            show({ type: "success", message: "Guruh muvaffaqiyatli o'chirildi!" });
        } catch (error) {
            console.error("Guruhni o'chirishda xatolik:", error);
            show({ type: "error", message: "Guruhni o'chirishda xatolik yuz berdi!" });
        }
    };

    const openAddStudentModal = (group) => {
        setSelectedGroup(group);
        setShowAddStudentModal(true);
    };

    // Birdaniga bir nechta studentni guruhga qo'shish
    const handleAddStudentsToGroup = async (studentIds) => {
        try {
            console.log("🔄 Adding students:", studentIds, "to group:", selectedGroup._id);

            // studentIds array ichidagi string ID larni tozalash
            const cleanStudentIds = studentIds.map(id => {
                // Agar object bo'lsa, ichidagi _id ni olish
                if (typeof id === 'object' && id._id) {
                    return id._id;
                }
                // Agar string bo'lsa, to'g'ridan-to'g'ri qaytarish
                return id.toString();
            });

            console.log("Clean student IDs:", cleanStudentIds);

            // Bulk API dan foydalanish
            try {
                const res = await axiosInstance.post(
                    `/groups/${selectedGroup._id}/students/bulk`,
                    { studentIds: cleanStudentIds }
                );

                console.log("✅ Bulk add response:", res.data);

                // Guruhni yangilash
                const updatedGroup = res.data.group || res.data;

                setGroups(prev => prev.map(g =>
                    g._id === selectedGroup._id ? updatedGroup : g
                ));

                show({
                    type: "success",
                    message: res.data.message || `${cleanStudentIds.length} ta o'quvchi guruhga qo'shildi!`
                });

                // Yangilangan guruhni qaytarish (modal yangilanishi uchun)
                return updatedGroup;

            } catch (bulkError) {
                console.log("❌ Bulk API failed, trying individual API:", bulkError);

                // Agar bulk API ishlamasa, har bir student uchun alohida so'rov
                const results = [];
                for (const studentId of cleanStudentIds) {
                    try {
                        const res = await axiosInstance.post(`/groups/${selectedGroup._id}/students`, {
                            studentId,
                            groupId: selectedGroup._id
                        });
                        results.push(res.data);
                        console.log(`✅ Student ${studentId} added individually`);
                    } catch (individualError) {
                        console.error(`❌ Error adding student ${studentId}:`, individualError.response?.data);
                    }
                }

                // Guruhni qayta yuklash
                const refreshedRes = await axiosInstance.get(`/groups/${selectedGroup._id}`);
                const updatedGroup = refreshedRes.data;

                setGroups(prev => prev.map(g =>
                    g._id === selectedGroup._id ? updatedGroup : g
                ));

                show({
                    type: "success",
                    message: `${results.length} ta o'quvchi guruhga qo'shildi! (${cleanStudentIds.length - results.length} ta xato)`
                });

                return updatedGroup;
            }

        } catch (error) {
            console.error("❌ O'quvchilarni qo'shishda xatolik:", error);
            show({
                type: "error",
                message: error.response?.data?.message || "O'quvchi qo'shishda xatolik yuz berdi!"
            });
            return null;
        }
    };

    const handleRemoveStudentsFromGroup = async (studentIds) => {
        if (!selectedGroup) {
            console.error("❌ No group selected for removal");
            show({ type: "error", message: "Guruh tanlanmagan!" });
            return null;
        }

        try {
            console.log(`🔄 Removing ${studentIds.length} students from group ${selectedGroup._id}`);

            // 1. PUT request orqali yangilash
            try {
                const response = await axiosInstance.put(
                    `/groups/${selectedGroup._id}/students/remove`,
                    { studentIds }
                );

                console.log("✅ Students removed successfully:", response.data);

                if (response.data.success) {
                    const updatedGroup = response.data.group;

                    // State yangilash
                    setGroups(prev => prev.map(g =>
                        g._id === selectedGroup._id ? updatedGroup : g
                    ));

                    // Guruhni tanlash (agar kerak bo'lsa)
                    setSelectedGroup(updatedGroup);

                    // Muvaffaqiyat xabari
                    show({
                        type: "success",
                        message: response.data.message,
                        duration: 3000
                    });

                    return updatedGroup;
                }

            } catch (error) {
                console.error("❌ PUT request failed:", {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });

                // 2. Agar PUT ishlamasa, eski DELETE usulini ishlatish
                console.log("🔄 Falling back to individual DELETE requests...");

                const results = [];
                for (const studentId of studentIds) {
                    try {
                        const response = await axiosInstance.delete(
                            `/groups/${selectedGroup._id}/students/${studentId}`
                        );

                        results.push({ studentId, success: true, data: response.data });
                        console.log(`✅ Student ${studentId} removed individually`);

                    } catch (individualError) {
                        console.error(`❌ Error removing student ${studentId}:`, individualError.message);
                        results.push({ studentId, success: false, error: individualError });
                    }
                }

                // 3. Guruhni yangilash
                const refreshedRes = await axiosInstance.get(`/groups/${selectedGroup._id}`);
                const updatedGroup = refreshedRes.data;

                // 4. Natijalarni ko'rsatish
                const successfulRemovals = results.filter(r => r.success);
                const failedRemovals = results.filter(r => !r.success);

                if (successfulRemovals.length > 0) {
                    show({
                        type: "success",
                        message: `${successfulRemovals.length} ta o'quvchi o'chirildi`,
                        duration: 3000
                    });
                }

                if (failedRemovals.length > 0) {
                    show({
                        type: "warning",
                        message: `${failedRemovals.length} ta o'quvchini o'chirishda muammo`,
                        duration: 4000
                    });
                }

                // State yangilash
                setGroups(prev => prev.map(g =>
                    g._id === selectedGroup._id ? updatedGroup : g
                ));

                return updatedGroup;
            }

        } catch (error) {
            console.error("❌ Error in handleRemoveStudentsFromGroup:", error);
            show({
                type: "error",
                message: "O'quvchilarni o'chirishda xatolik yuz berdi",
                duration: 5000
            });
            return null;
        }
    };

    // Bitta studentni guruhdan o'chirish (guruh kartasidan)
    const handleRemoveSingleStudent = async (studentId, group) => {
        if (!window.confirm("Bu o'quvchini guruhdan o'chirmoqchimisiz?")) return;

        try {
            console.log("🔄 Removing single student:", {
                studentId: studentId,
                groupId: group._id,
                groupName: group.name
            });

            // studentId ni to'g'ri formatga o'tkazish
            const cleanStudentId = typeof studentId === 'object' ? studentId._id : studentId.toString();

            // Guruhni tanlash
            setSelectedGroup(group);

            // Studentni o'chirish
            const updatedGroup = await handleRemoveStudentsFromGroup([cleanStudentId]);

            if (updatedGroup) {
                console.log("✅ Student removed, updated group:", updatedGroup);
                // Guruhni yangilash
                setGroups(prev => prev.map(g =>
                    g._id === group._id
                        ? updatedGroup
                        : g
                ));
            }

        } catch (error) {
            console.error("❌ O'quvchini o'chirishda xatolik:", error);
            show({ type: "error", message: "O'quvchini o'chirishda xatolik!" });
        }
    };

    // Guruh kartasiga bosganda davomat sahifasiga o'tish
    const handleGroupClick = (groupId) => {
        navigate(`/attendance/${groupId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto mt-20">
            {/* Teacher Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-sm border border-blue-100 dark:border-gray-700">
                <img
                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                    src={teacher?.avatar || "/default-avatar.png"}
                    alt={teacher?.fullName}
                />
                <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {teacher?.fullName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {teacher?.subjects?.join(', ')}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium">
                            {teacher?.phone}
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 rounded-full text-sm font-medium">
                            {groups.length} ta guruh
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="sm:ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    <FaUserPlus size={18} />
                    + Yangi guruh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatsCard
                    title="Guruhlar soni"
                    value={groups.length}
                    color="blue"
                />
                <StatsCard
                    title="Jami o'quvchilar"
                    value={totalStudents}
                    color="indigo"
                />
                <StatsCard
                    title="O'rtacha o'quvchi"
                    value={averageStudents}
                    color="purple"
                />
            </div>

            {/* Groups Section */}
            {groups.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-blue-100 dark:border-gray-700">
                    <div className="text-6xl mb-4 text-blue-200 dark:text-blue-900/30">🏫</div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Hozircha guruh mavjud emas
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        O'qituvchi uchun birinchi guruhni yaratish uchun "Yangi guruh" tugmasini bosing
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                    >
                        <FaUserPlus size={18} />
                        Birinchi guruhni yaratish
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {groups.map(group => (
                        <GroupCard
                            key={group._id}
                            group={group}
                            allStudents={allStudents}
                            handleEditGroup={handleEditGroup}
                            handleDeleteGroup={handleDeleteGroup}
                            openAddStudentModal={openAddStudentModal}
                            handleRemoveSingleStudent={handleRemoveSingleStudent}
                            handleGroupClick={handleGroupClick}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showModal && (
                    <GroupModal
                        editingGroup={editingGroup}
                        newGroup={newGroup}
                        setNewGroup={setNewGroup}
                        subjects={subjects}
                        daysList={daysList}
                        handleSaveGroup={handleSaveGroup}
                        setShowModal={setShowModal}
                        setEditingGroup={setEditingGroup}
                    />
                )}

                {/* Student Add Modal */}
                {showAddStudentModal && selectedGroup && (
                    <StudentAddModal
                        group={selectedGroup}
                        allStudents={allStudents}
                        currentGroupStudents={getGroupStudents(selectedGroup)}
                        onClose={() => {
                            setShowAddStudentModal(false);
                            setSelectedGroup(null);
                        }}
                        onAddStudents={handleAddStudentsToGroup}
                        onRemoveStudents={handleRemoveStudentsFromGroup}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}