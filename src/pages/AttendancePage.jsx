import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosConfig";
import { useNotification } from "../components/Notification";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import {
    MdGroup,
    MdCheckCircle,
    MdAccessTime,
    MdToday,
    MdPeople,
    MdSchedule,
    MdCheck,
    MdClear,
    MdEditCalendar,
    MdPerson,
    MdArrowDropDown,
    MdSearch,
    MdWarning,
    MdAdd
} from "react-icons/md";
import { Link } from "react-router-dom";

export default function AttendancePage() {
    const { user } = useContext(AuthContext);
    const [teachers, setTeachers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [saving, setSaving] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [searchTeacher, setSearchTeacher] = useState("");
    const [searchGroup, setSearchGroup] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const Api = import.meta.env.VITE_API_URL.slice(0) || "http://localhost:5000";
    const studentImgApi = Api.slice(0, -4);
    const { show } = useNotification();

    // User rolini aniqlash
    const isTeacher = user?.role === "teacher";
    const isAdmin = user?.role === "admin" || user?.role === "superadmin";

    useEffect(() => {
        // Agar teacher bo'lsa, o'z ma'lumotlarini olish
        if (isTeacher && user?.teacherId) {
            fetchTeacherData(user.teacherId);
        } else if (isAdmin) {
            // Agar admin bo'lsa, barcha o'qituvchilarni olish
            fetchTeachers();
        }
    }, [user]);

    useEffect(() => {
        if (selectedTeacher) {
            fetchTeacherGroups(selectedTeacher._id);
        }
    }, [selectedTeacher]);

    // Teacher o'z ma'lumotlarini olish
    const fetchTeacherData = async (teacherId) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/teachers/${teacherId}`);
            const teacherData = res.data;

            // Teacher o'zini tanlash
            setSelectedTeacher(teacherData);

            // Teacherning guruhlarini olish
            await fetchTeacherGroups(teacherId);
        } catch (error) {
            console.error("Teacher data fetch error:", error);
            show({ type: "error", message: "Ma'lumotlarni yuklashda xatolik!" });
        } finally {
            setLoading(false);
        }
    };

    // Admin uchun barcha teacherlarni olish
    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/teachers");
            setTeachers(res.data);
        } catch (error) {
            show({ type: "error", message: "O'qituvchilarni yuklashda xatolik!" });
        } finally {
            setLoading(false);
        }
    };

    const fetchTeacherGroups = async (teacherId) => {
        try {
            setLoadingGroups(true);
            const res = await axiosInstance.get(`/groups?teacher=${teacherId}`);
            setGroups(res.data);
        } catch (error) {
            console.error("Groups fetch error:", error);
            show({ type: "error", message: "Guruhlarni yuklashda xatolik!" });
        } finally {
            setLoadingGroups(false);
        }
    };

    const handleGroupSelect = async (group) => {
        try {
            setLoading(true);
            setSelectedGroup(group);
            setShowGroupModal(false);
            setErrorMessage("");

            console.log("Selecting group:", {
                groupId: group._id,
                date: date,
                groupName: group.name,
                studentsCount: group.students?.length || 0
            });

            // Agar guruhda o'quvchi bo'lmasa
            if (!group.students || group.students.length === 0) {
                setErrorMessage("Ushbu guruhda hech qanday o'quvchi yo'q. Iltimos, avval guruhga o'quvchi qo'shing.");
                setAttendance(null);
                setStudents([]);
                setLoading(false);
                return;
            }

            // Davomatni olish yoki yaratish
            const res = await axiosInstance.post("/attendance", {
                groupId: group._id,
                date: date,
            });

            console.log("Attendance API response:", res.data);

            if (res.data.attendance) {
                let updatedStudents = [...res.data.attendance.students || []];

                // Yangi qo'shilgan o'quvchilarni tekshirish
                const allGroupStudentIds = new Set(group.students.map(s => s._id));
                const attendanceStudentIds = new Set(updatedStudents.map(s => s.student._id));
                const missingStudentIds = [...allGroupStudentIds].filter(id => !attendanceStudentIds.has(id));

                if (missingStudentIds.length > 0) {
                    const missingStudents = group.students.filter(s =>
                        missingStudentIds.includes(s._id)
                    );

                    missingStudents.forEach(missingStudent => {
                        updatedStudents.push({
                            student: missingStudent,
                            status: "absent",
                            arrivalTime: null,
                            notes: "",
                            isExcused: false,
                            excuseReason: "",
                            _id: `temp-${Date.now()}-${Math.random()}`
                        });
                    });

                    console.log(`Added ${missingStudents.length} missing students to attendance`);
                }

                setAttendance(res.data.attendance);
                setStudents(updatedStudents);
                setErrorMessage("");
            } else {
                // Agar davomat bo'lmasa
                setAttendance(null);
                setStudents(group.students?.map(student => ({
                    student,
                    status: "absent",
                    arrivalTime: null,
                    notes: "",
                    isExcused: false,
                    excuseReason: "",
                })) || []);
            }
        } catch (error) {
            console.error("Group select error:", error);
            console.error("Error response data:", error.response?.data);

            let errorMsg = "Davomat olishda xatolik!";

            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;

                if (errorMsg.includes("Guruhda hech qanday o'quvchi yo'q")) {
                    setErrorMessage(errorMsg);
                    setAttendance(null);
                    setStudents([]);
                }
            }

            show({
                type: "error",
                message: errorMsg,
                duration: 5000
            });

        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setStudents(prev => prev.map(student => {
            if (student.student._id === studentId) {
                const currentTime = new Date().toTimeString().slice(0, 5);
                return {
                    ...student,
                    status,
                    arrivalTime: status === "present" || status === "late" ? currentTime : null
                };
            }
            return student;
        }));
    };

    const handleSaveAttendance = async () => {
        if (!selectedGroup || !selectedTeacher) return;

        try {
            setSaving(true);

            // Teacher ID ni aniqlash
            const teacherId = isTeacher ? user.teacherId : selectedTeacher._id;

            const formattedStudents = students.map(s => ({
                studentId: s.student._id,
                status: s.status,
                arrivalTime: s.arrivalTime,
                notes: s.notes,
                isExcused: s.isExcused,
                excuseReason: s.excuseReason,
            }));

            const res = await axiosInstance.post("/attendance/quick", {
                groupId: selectedGroup._id,
                teacherId: teacherId, // To'g'ri teacher ID
                students: formattedStudents,
                date: date,
            });

            show({ type: "success", message: "Davomat saqlandi!" });
            setAttendance(res.data.attendance);
            setStudents(res.data.attendance.students || []);
            setErrorMessage("");
        } catch (error) {
            console.error("Save attendance error:", error);
            show({
                type: "error",
                message: error.response?.data?.message || "Davomat saqlashda xatolik!"
            });
        } finally {
            setSaving(false);
        }
    };

    const handleMarkAll = (status) => {
        const currentTime = new Date().toTimeString().slice(0, 5);
        setStudents(prev => prev.map(student => ({
            ...student,
            status,
            arrivalTime: status === "present" || status === "late" ? currentTime : null
        })));
    };

    // Filtered teachers (faqat admin uchun)
    const filteredTeachers = isAdmin ? teachers.filter(teacher =>
        teacher.fullName?.toLowerCase().includes(searchTeacher.toLowerCase()) ||
        teacher.phone?.includes(searchTeacher) ||
        teacher.subjects?.some(subject =>
            subject.toLowerCase().includes(searchTeacher.toLowerCase())
        )
    ) : [];

    // Filtered groups
    const filteredGroups = groups.filter(group =>
        group.name?.toLowerCase().includes(searchGroup.toLowerCase()) ||
        group.subject?.toLowerCase().includes(searchGroup.toLowerCase()) ||
        group.roomNumber?.toString().includes(searchGroup)
    );

    const countStudentsInGroup = (group) => {
        return group.students?.length || 0;
    };

    const getGroupDisplayName = (group) => {
        const studentCount = countStudentsInGroup(group);
        return `${group.name} (${studentCount} ta o'quvchi)`;
    };

    const stats = {
        present: students.filter(s => s.status === "present").length,
        absent: students.filter(s => s.status === "absent").length,
        late: students.filter(s => s.status === "late").length,
        total: students.length,
    };

    return (
        <div className="p-4 md:p-6 mt-10">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                            <MdEditCalendar className="inline mr-2" />
                            Davomat Olish
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {isTeacher ? "Guruhni tanlang, davomat oling" : "O'qituvchi va guruhni tanlang, davomat oling"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-3">
                            <div className="flex items-center gap-2">
                                <MdToday className="text-blue-500" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-transparent border-none outline-none text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selection Cards - FAQRAT ADMIN/UCHUN TEACHER TANLASH */}
                {isAdmin ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Teacher Selection Card (faqat admin uchun) */}
                        <div className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedTeacher
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                            }`} onClick={() => setShowTeacherModal(true)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                                        <MdPerson className="text-2xl text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {selectedTeacher ? selectedTeacher.fullName : "O'qituvchi tanlang"}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedTeacher
                                                ? `${selectedTeacher.subjects?.join(", ")} • ${selectedTeacher.phone}`
                                                : "Davomat oladigan o'qituvchini tanlang"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <MdArrowDropDown className="text-2xl text-gray-500" />
                            </div>
                        </div>

                        {/* Group Selection Card */}
                        <div className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedGroup
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                            } ${!selectedTeacher ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => selectedTeacher && setShowGroupModal(true)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
                                        <MdGroup className="text-2xl text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {selectedGroup ? getGroupDisplayName(selectedGroup) : "Guruh tanlang"}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedGroup
                                                ? `${selectedGroup.subject} • ${selectedGroup.roomNumber}-xona • ${selectedGroup.time}`
                                                : selectedTeacher
                                                    ? "Davomat oladigan guruhni tanlang"
                                                    : "Avval o'qituvchi tanlang"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <MdArrowDropDown className="text-2xl text-gray-500" />
                            </div>
                        </div>
                    </div>
                ) : (
                    // TEACHER UCHUN FAQRAT GROUP SELECTION
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {/* Teacher Info Card (faqat teacher uchun) */}
                        {isTeacher && selectedTeacher && (
                            <div className="p-5 rounded-2xl border border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                                            <MdPerson className="text-2xl text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {selectedTeacher.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {selectedTeacher.subjects?.join(", ")} • {selectedTeacher.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium">
                                        Teacher
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Group Selection Card (teacher uchun) */}
                        <div className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedGroup
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                            }`}
                            onClick={() => setShowGroupModal(true)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
                                        <MdGroup className="text-2xl text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {selectedGroup ? getGroupDisplayName(selectedGroup) : "Guruh tanlang"}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedGroup
                                                ? `${selectedGroup.subject} • ${selectedGroup.roomNumber}-xona • ${selectedGroup.time}`
                                                : "Davomat oladigan guruhni tanlang"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <MdArrowDropDown className="text-2xl text-gray-500" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800/30 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <MdWarning className="text-2xl text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                                    Diqqat!
                                </h3>
                                <p className="text-red-700 dark:text-red-400 mb-3">
                                    {errorMessage}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        to="/students"
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all text-sm"
                                    >
                                        O'quvchilar sahifasiga o'tish
                                    </Link>
                                    <Link
                                        to="/groups"
                                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all text-sm"
                                    >
                                        Guruhlar sahifasiga o'tish
                                    </Link>
                                    <button
                                        onClick={() => setShowGroupModal(true)}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
                                    >
                                        Boshqa guruh tanlash
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                {selectedGroup && students.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800/30 rounded-2xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kelgan</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.present}
                                    </h3>
                                </div>
                                <MdCheckCircle className="text-3xl text-green-500 dark:text-green-400" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800/30 rounded-2xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kelmagan</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.absent}
                                    </h3>
                                </div>
                                <MdClear className="text-3xl text-red-500 dark:text-red-400" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kechikkan</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.late}
                                    </h3>
                                </div>
                                <MdAccessTime className="text-3xl text-amber-500 dark:text-amber-400" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30 rounded-2xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Jami</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.total}
                                    </h3>
                                </div>
                                <MdPeople className="text-3xl text-blue-500 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {!selectedGroup ? (
                    <div className="p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <MdGroup className="text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Davomat olishni boshlang
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {isTeacher
                                    ? "Davomat olish uchun guruhni tanlang"
                                    : "Davomat olish uchun avval o'qituvchi, keyin guruhni tanlang"
                                }
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                {isAdmin && (
                                    <button
                                        onClick={() => setShowTeacherModal(true)}
                                        className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
                                    >
                                        O'qituvchi tanlash
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowGroupModal(true)}
                                    disabled={isAdmin && !selectedTeacher}
                                    className={`px-5 py-3 rounded-xl font-medium transition-all ${(isTeacher || (isAdmin && selectedTeacher))
                                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Guruh tanlash
                                </button>
                            </div>
                        </div>
                    </div>
                ) : errorMessage ? (
                    <div className="p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <MdWarning className="text-6xl text-amber-500 dark:text-amber-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                {selectedGroup.name} guruhida o'quvchi yo'q
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Ushbu guruhda hech qanday o'quvchi ro'yxatdan o'tmagan.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {selectedGroup.name} - Davomat
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedGroup.subject} • {selectedGroup.roomNumber}-xona
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            ⏰ {selectedGroup.time}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            👨‍🏫 {selectedTeacher?.fullName || user?.name}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            👥 {students.length} ta o'quvchi
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleMarkAll("present")}
                                        className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors text-sm font-medium"
                                    >
                                        Hammasi keldi
                                    </button>
                                    <button
                                        onClick={() => handleMarkAll("absent")}
                                        className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors text-sm font-medium"
                                    >
                                        Hammasi kelmadi
                                    </button>
                                    <button
                                        onClick={() => setShowGroupModal(true)}
                                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors text-sm font-medium"
                                    >
                                        Guruhni o'zgartirish
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Students List */}
                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader />
                                </div>
                            ) : students.length === 0 ? (
                                <div className="text-center py-12">
                                    <MdPeople className="text-5xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        O'quvchilar topilmadi
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Ushbu guruhda hech qanday o'quvchi yo'q
                                    </p>
                                    <Link
                                        to={`/groups/${selectedGroup._id}/edit`}
                                        className="px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all inline-flex items-center gap-2"
                                    >
                                        <MdAdd />
                                        Guruhga o'quvchi qo'shish
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {students.map((student) => {
                                            const statusColors = {
                                                present: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                                                absent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                                                late: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                                                excused: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
                                            };

                                            return (
                                                <div
                                                    key={student.student._id}
                                                    className={`p-4 rounded-xl border transition-all ${student.status === "present"
                                                        ? "border-green-200 dark:border-green-800"
                                                        : student.status === "absent"
                                                            ? "border-red-200 dark:border-red-800"
                                                            : student.status === "late"
                                                                ? "border-amber-200 dark:border-amber-800"
                                                                : "border-purple-200 dark:border-purple-800"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {student.student.image ? (
                                                                <img
                                                                    src={`${studentImgApi + student.student.image}`}
                                                                    alt={student.student.fullName}
                                                                    className="w-12 h-12 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                                                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                                        {student.student.fullName?.[0] || "?"}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                                    {student.student.fullName}
                                                                </h3>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {student.student.className}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <div className="flex gap-1">
                                                                {["present", "absent", "late"].map((status) => (
                                                                    <button
                                                                        key={status}
                                                                        onClick={() => handleStatusChange(student.student._id, status)}
                                                                        className={`p-2 rounded-lg transition-colors ${student.status === status
                                                                            ? status === "present"
                                                                                ? "bg-green-500 text-white"
                                                                                : status === "absent"
                                                                                    ? "bg-red-500 text-white"
                                                                                    : "bg-amber-500 text-white"
                                                                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                                            }`}
                                                                        title={
                                                                            status === "present" ? "Keldi" :
                                                                                status === "absent" ? "Kelmadi" :
                                                                                    "Kechikdi"
                                                                        }
                                                                    >
                                                                        {status === "present" && <MdCheck size={18} />}
                                                                        {status === "absent" && <MdClear size={18} />}
                                                                        {status === "late" && <MdAccessTime size={18} />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[student.status]}`}>
                                                                {student.status === "present" ? "Keldi" :
                                                                    student.status === "absent" ? "Kelmadi" :
                                                                        student.status === "late" ? "Kechikdi" : "Sababli"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {student.arrivalTime && (
                                                        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                                            Kelish vaqti: {student.arrivalTime}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Save Button */}
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={handleSaveAttendance}
                                            disabled={saving || students.length === 0}
                                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                        >
                                            {saving ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Saqlanmoqda...
                                                </span>
                                            ) : attendance ? (
                                                "Davomatni Yangilash"
                                            ) : (
                                                "Davomatni Saqlash"
                                            )}
                                        </button>
                                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                                            {attendance
                                                ? "Davomat allaqachon saqlangan. Yangilash uchun tugmani bosing."
                                                : "Davomatni saqlash uchun tugmani bosing."}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Teacher Selection Modal - FAQRAT ADMIN UCHUN */}
            {showTeacherModal && isAdmin && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    O'qituvchi tanlang
                                </h2>
                                <button
                                    onClick={() => setShowTeacherModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <MdClear size={24} />
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="relative">
                                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="O'qituvchi ismi, fani yoki telefon raqami bo'yicha qidirish..."
                                        value={searchTeacher}
                                        onChange={(e) => setSearchTeacher(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {filteredTeachers.length === 0 ? (
                                <div className="text-center py-12">
                                    <MdPerson className="text-5xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        O'qituvchi topilmadi
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Qidiruv bo'yicha hech qanday o'qituvchi topilmadi
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredTeachers.map(teacher => (
                                        <div
                                            key={teacher._id}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTeacher?._id === teacher._id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                                                }`}
                                            onClick={() => {
                                                setSelectedTeacher(teacher);
                                                setSelectedGroup(null);
                                                setAttendance(null);
                                                setStudents([]);
                                                setErrorMessage("");
                                                setShowTeacherModal(false);
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {teacher.avatar ? (
                                                    <img
                                                        src={`${teacher.avatar}`}
                                                        alt={teacher.fullName}
                                                        className="w-12 h-12 rounded-full border-1 border-gray-300 dark:border-gray-600"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                            {teacher.fullName?.[0] || "?"}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {teacher.fullName}
                                                    </h3>
                                                    <p className="flex flex-col gap-3">
                                                        <div className="flex flex-wrap gap-2">
                                                            {teacher.subjects?.map((sub) => (
                                                                <span
                                                                    key={sub}
                                                                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600"
                                                                >
                                                                    {sub}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <span className="inline-block w-1/2  text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600">
                                                            {teacher.phone}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Group Selection Modal */}
            {showGroupModal && (isTeacher || (isAdmin && selectedTeacher)) && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        Guruh tanlang
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {isTeacher
                                            ? `O'qituvchi: ${user?.name}`
                                            : `O'qituvchi: ${selectedTeacher?.fullName}`
                                        }
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowGroupModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <MdClear size={24} />
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="relative">
                                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Guruh nomi, fani yoki xona raqami bo'yicha qidirish..."
                                        value={searchGroup}
                                        onChange={(e) => setSearchGroup(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {loadingGroups ? (
                                <div className="flex justify-center py-12">
                                    <Loader />
                                </div>
                            ) : filteredGroups.length === 0 ? (
                                <div className="text-center py-12">
                                    <MdGroup className="text-5xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Guruh topilmadi
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchGroup
                                            ? "Qidiruv bo'yicha hech qanday guruh topilmadi"
                                            : "Bu o'qituvchiga biriktirilgan guruh yo'q"}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredGroups.map(group => {
                                        const studentCount = countStudentsInGroup(group);
                                        const hasStudents = studentCount > 0;

                                        return (
                                            <div
                                                key={group._id}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedGroup?._id === group._id
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                                                    } ${!hasStudents ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30' : ''}`}
                                                onClick={() => handleGroupSelect(group)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                                {group.name}
                                                            </h3>
                                                            {!hasStudents && (
                                                                <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-medium rounded-full">
                                                                    O'quvchi yo'q
                                                                </span>
                                                            )}
                                                            {studentCount > 0 && (
                                                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">
                                                                    {studentCount} ta o'quvchi
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                            {group.subject} • {group.roomNumber}-xona • {group.time}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                                <MdPeople />
                                                                {studentCount} ta o'quvchi
                                                            </span>
                                                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                                <MdSchedule />
                                                                {group.days?.join(', ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}