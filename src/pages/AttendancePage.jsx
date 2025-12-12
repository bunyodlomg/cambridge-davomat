import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosConfig";
import { useNotification } from "../components/Notification";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import AttendanceHeader from "../components/Attendance/AttendanceHeader";
import AttendanceSelectors from "../components/Attendance/AttendanceSelectors";
import AttendanceStats from "../components/Attendance/AttendanceStats";
import AttendanceContent from "../components/Attendance/AttendanceContent";
import TeacherModal from "../components/Attendance/TeacherModal";
import GroupModal from "../components/Attendance/GroupModal";
import ErrorMessage from "../components/Attendance/ErrorMessage";

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

    // Teacher rolini tekshirish
    const isTeacher = user?.role === "teacher";

    useEffect(() => {
        if (isTeacher) {
            // Agar teacher bo'lsa, o'zini selectedTeacher qilib o'rnatish
            setSelectedTeacher(user);
            fetchTeacherGroups(user._id);
        } else {
            // Admin yoki superadmin bo'lsa, barcha teacherlarni yuklash
            fetchTeachers();
        }
    }, [user]);

    useEffect(() => {
        if (selectedTeacher && !isTeacher) {
            fetchTeacherGroups(selectedTeacher._id);
        }
    }, [selectedTeacher]);

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

            if (!group.students || group.students.length === 0) {
                setErrorMessage("Ushbu guruhda hech qanday o'quvchi yo'q. Iltimos, avval guruhga o'quvchi qo'shing.");
                setAttendance(null);
                setStudents([]);
                setLoading(false);
                return;
            }

            const res = await axiosInstance.post("/Attendance", {
                groupId: group._id,
                date: date,
            });

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
                }

                setAttendance(res.data.attendance);
                setStudents(updatedStudents);
                setErrorMessage("");
            } else {
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

            const formattedStudents = students.map(s => ({
                studentId: s.student._id,
                status: s.status,
                arrivalTime: s.arrivalTime,
                notes: s.notes,
                isExcused: s.isExcused,
                excuseReason: s.excuseReason,
            }));

            const res = await axiosInstance.post("/Attendance/quick", {
                groupId: selectedGroup._id,
                teacherId: selectedTeacher._id,
                students: formattedStudents,
                date: date,
            });

            show({ type: "success", message: "Davomat saqlandi!" });
            setAttendance(res.data.attendance);
            setStudents(res.data.attendance.students || []);
            setErrorMessage("");
        } catch (error) {
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

    const handleTeacherSelect = (teacher) => {
        setSelectedTeacher(teacher);
        setSelectedGroup(null);
        setAttendance(null);
        setStudents([]);
        setErrorMessage("");
        setShowTeacherModal(false);
    };

    const stats = {
        present: students.filter(s => s.status === "present").length,
        absent: students.filter(s => s.status === "absent").length,
        late: students.filter(s => s.status === "late").length,
        total: students.length,
    };

    if (loading && !isTeacher) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 mt-10">
            <AttendanceHeader date={date} setDate={setDate} />

            <AttendanceSelectors
                isTeacher={isTeacher}
                selectedTeacher={selectedTeacher}
                selectedGroup={selectedGroup}
                setShowTeacherModal={setShowTeacherModal}
                setShowGroupModal={setShowGroupModal}
            />

            {errorMessage && (
                <ErrorMessage
                    errorMessage={errorMessage}
                    setShowGroupModal={setShowGroupModal}
                    group={selectedGroup}
                />
            )}

            {selectedGroup && students.length > 0 && (
                <AttendanceStats stats={stats} />
            )}

            <AttendanceContent
                selectedGroup={selectedGroup}
                errorMessage={errorMessage}
                loading={loading}
                students={students}
                attendance={attendance}
                saving={saving}
                selectedTeacher={selectedTeacher}
                studentImgApi={studentImgApi}
                handleStatusChange={handleStatusChange}
                handleMarkAll={handleMarkAll}
                handleSaveAttendance={handleSaveAttendance}
                setShowGroupModal={setShowGroupModal}
                setShowTeacherModal={setShowTeacherModal}
                isTeacher={isTeacher}
            />

            {!isTeacher && showTeacherModal && (
                <TeacherModal
                    teachers={teachers}
                    selectedTeacher={selectedTeacher}
                    searchTeacher={searchTeacher}
                    setSearchTeacher={setSearchTeacher}
                    handleTeacherSelect={handleTeacherSelect}
                    setShowTeacherModal={setShowTeacherModal}
                />
            )}

            {showGroupModal && selectedTeacher && (
                <GroupModal
                    groups={groups}
                    selectedGroup={selectedGroup}
                    selectedTeacher={selectedTeacher}
                    searchGroup={searchGroup}
                    setSearchGroup={setSearchGroup}
                    loadingGroups={loadingGroups}
                    handleGroupSelect={handleGroupSelect}
                    setShowGroupModal={setShowGroupModal}
                />
            )}
        </div>
    );
}