import React, { useState } from "react";
import { MdClose, MdCheck, MdClear, MdAccessTime, MdEdit, MdSave } from "react-icons/md";

export default function AttendanceDetailModal({ isOpen, onClose, attendance, onUpdate, onQuickSave }) {
    const [students, setStudents] = useState(attendance.students || []);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const statusColors = {
        present: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        absent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        late: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        excused: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };

    const statusIcons = {
        present: <MdCheck className="text-green-500" />,
        absent: <MdClear className="text-red-500" />,
        late: <MdAccessTime className="text-amber-500" />,
        excused: <MdCheck className="text-purple-500" />,
    };

    const handleStatusChange = (studentId, status) => {
        if (!editing) return;

        setStudents(prev => prev.map(student => {
            if (student.student._id === studentId) {
                return { ...student, status };
            }
            return student;
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formattedStudents = students.map(s => ({
                studentId: s.student._id,
                status: s.status,
                arrivalTime: s.arrivalTime,
                notes: s.notes,
                isExcused: s.isExcused,
                excuseReason: s.excuseReason,
            }));

            await onUpdate(attendance._id, formattedStudents);
            setEditing(false);
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleQuickSave = async () => {
        setSaving(true);
        try {
            const formattedStudents = students.map(s => ({
                studentId: s.student._id,
                status: s.status,
                arrivalTime: s.status === "present" || s.status === "late"
                    ? new Date().toTimeString().slice(0, 5)
                    : null,
            }));

            await onQuickSave(attendance.group._id, formattedStudents);
        } catch (error) {
            console.error("Quick save error:", error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {attendance.group?.name} - Davomat
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {new Date(attendance.date).toLocaleDateString()} • {attendance.startTime}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {editing ? (
                                <>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                        disabled={saving}
                                    >
                                        Bekor qilish
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 flex items-center gap-2"
                                    >
                                        <MdSave />
                                        {saving ? "Saqlandi..." : "Saqlash"}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleQuickSave}
                                        disabled={saving}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 flex items-center gap-2"
                                    >
                                        <MdSave />
                                        Tezkor saqlash
                                    </button>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 flex items-center gap-2"
                                    >
                                        <MdEdit />
                                        Tahrirlash
                                    </button>
                                </>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {attendance.totalPresent}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Kelgan</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {attendance.totalAbsent}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Kelgan</div>
                        </div>
                        <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {attendance.totalLate}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Kechikkan</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {students.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Jami</div>
                        </div>
                    </div>
                </div>

                {/* Students List */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {students.map((student) => (
                            <div
                                key={student.student._id}
                                className={`p-4 rounded-xl border ${editing ? "hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer" : ""
                                    } ${student.status === "present"
                                        ? "border-green-200 dark:border-green-800"
                                        : student.status === "absent"
                                            ? "border-red-200 dark:border-red-800"
                                            : student.status === "late"
                                                ? "border-amber-200 dark:border-amber-800"
                                                : "border-purple-200 dark:border-purple-800"
                                    }`}
                                onClick={() => {
                                    if (!editing) return;
                                    const nextStatus =
                                        student.status === "present" ? "absent" :
                                            student.status === "absent" ? "late" :
                                                student.status === "late" ? "present" : "present";
                                    handleStatusChange(student.student._id, nextStatus);
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {student.student.image ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}${student.student.image}`}
                                                alt={student.student.fullName}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                    {student.student.fullName[0]}
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
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[student.status]}`}>
                                            <span className="flex items-center gap-1">
                                                {statusIcons[student.status]}
                                                {student.status === "present" ? "Keldi" :
                                                    student.status === "absent" ? "Kelmadi" :
                                                        student.status === "late" ? "Kechikdi" : "Sababli"}
                                            </span>
                                        </span>
                                        {student.arrivalTime && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {student.arrivalTime}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {student.notes && (
                                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {student.notes}
                                        </p>
                                    </div>
                                )}

                                {student.isExcused && student.excuseReason && (
                                    <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <p className="text-sm text-purple-600 dark:text-purple-400">
                                            Sabab: {student.excuseReason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                {editing && (
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => {
                                    setStudents(students.map(s => ({ ...s, status: "present" })));
                                }}
                                className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/40"
                            >
                                Hammasi keldi
                            </button>
                            <button
                                onClick={() => {
                                    setStudents(students.map(s => ({ ...s, status: "absent" })));
                                }}
                                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40"
                            >
                                Hammasi kelmadi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}