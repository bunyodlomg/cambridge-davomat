import React from "react";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import StudentCard from "./StudentCard";
import { MdGroup, MdWarning, MdPeople, MdAdd } from "react-icons/md";

export default function AttendanceContent({
    selectedGroup,
    errorMessage,
    loading,
    students,
    attendance,
    saving,
    selectedTeacher,
    studentImgApi,
    handleStatusChange,
    handleMarkAll,
    handleSaveAttendance,
    setShowGroupModal,
    setShowTeacherModal,
    isTeacher
}) {
    if (!selectedGroup) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="max-w-md mx-auto">
                        <MdGroup className="text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Davomat olishni boshlang
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {isTeacher
                                ? "Davomat olish uchun guruhni tanlang."
                                : "Davomat olish uchun yuqoridagi kartochkalardan avval o'qituvchi, keyin guruhni tanlang."
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {!isTeacher && (
                                <button
                                    onClick={() => setShowTeacherModal(true)}
                                    className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
                                >
                                    O'qituvchi tanlash
                                </button>
                            )}
                            <button
                                onClick={() => selectedTeacher && setShowGroupModal(true)}
                                disabled={!selectedTeacher}
                                className={`px-5 py-3 rounded-xl font-medium transition-all ${selectedTeacher
                                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Guruh tanlash
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="max-w-md mx-auto">
                        <MdWarning className="text-6xl text-amber-500 dark:text-amber-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            {selectedGroup.name} guruhida o'quvchi yo'q
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Ushbu guruhda hech qanday o'quvchi ro'yxatdan o'tmagan. Davomat olish uchun avval guruhga o'quvchi qo'shing.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                                👨‍🏫 {selectedTeacher.fullName}
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
                            {students.map((student) => (
                                <StudentCard
                                    key={student.student._id}
                                    student={student}
                                    studentImgApi={studentImgApi}
                                    handleStatusChange={handleStatusChange}
                                />
                            ))}
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
        </div>
    );
}