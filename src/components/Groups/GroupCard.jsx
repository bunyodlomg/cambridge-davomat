import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaUserPlus, FaCalendarAlt, FaClock, FaDoorOpen, FaBook } from "react-icons/fa";

const Api = import.meta.env.VITE_API_URL.slice(0) || "http://localhost:5000";
const studentImgApi = Api.slice(0, -4);

const GroupCard = ({
    group,
    allStudents,
    handleEditGroup,
    handleDeleteGroup,
    openAddStudentModal,
    handleGroupClick
}) => {
    const getGroupStudents = () => {
        if (!group.students || !Array.isArray(group.students)) return [];

        if (group.students.length > 0 && typeof group.students[0] === 'string') {
            return group.students
                .map(studentId => allStudents.find(s => s._id === studentId))
                .filter(student => student !== undefined);
        }

        return group.students;
    };

    const groupStudents = getGroupStudents();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
        >
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => openAddStudentModal(group)}
                    className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors shadow-sm"
                    title="O'quvchi qo'shish"
                >
                    <FaUserPlus size={16} />
                </button>
                <button
                    onClick={() => handleEditGroup(group)}
                    className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors shadow-sm"
                    title="Tahrirlash"
                >
                    <FaEdit size={16} />
                </button>
                <button
                    onClick={() => handleDeleteGroup(group._id)}
                    className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors shadow-sm"
                    title="O'chirish"
                >
                    <FaTrash size={16} />
                </button>
            </div>

            {/* Group Info - Clickable for attendance */}
            <div
                onClick={() => handleGroupClick(group._id)}
                className="cursor-pointer mb-4"
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                        <FaBook className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            {group.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {groupStudents.length} ta o'quvchi
                        </p>
                    </div>
                </div>

                <div className="space-y-3">


                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <FaBook className="text-blue-500 dark:text-blue-400" size={14} />
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Fan:</span>
                                <span className="block font-semibold text-gray-800 dark:text-white">
                                    {group.subject}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <FaDoorOpen className="text-purple-500 dark:text-purple-400" size={14} />
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Xona:</span>
                                <span className="block font-semibold text-gray-800 dark:text-white">
                                    {group.roomNumber}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <FaClock className="text-amber-500 dark:text-amber-400" size={14} />
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Vaqt:</span>
                                <span className="block font-semibold text-gray-800 dark:text-white">
                                    {group.time}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <FaCalendarAlt className="text-emerald-500 dark:text-emerald-400" size={14} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dars kunlari:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {group.days.map((day, index) => (
                                <span
                                    key={`${group._id}-day-${index}`}
                                    className="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-800"
                                >
                                    {day.slice(0, 2)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Students Section */}
            <div className="pt-2">
                {groupStudents.length > 0 ? (
                    <div className="space-y-2 overflow-y-auto max-h-60 pr-2">
                        {groupStudents.map((student, index) => {
                            if (!student) return null;

                            return (
                                <div
                                    key={`${group._id}-student-${student._id || index}`}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group/student"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {student.image ? (
                                            <div className="relative">
                                                <img
                                                    src={`${studentImgApi}${student.image}`}
                                                    alt={student.fullName}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                            </div>
                                        ) : (
                                            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                                                <span className="text-white font-bold text-sm">
                                                    {(student.fullName || "?")[0]}
                                                </span>
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <span className="text-sm font-semibold text-gray-800 dark:text-white truncate block">
                                                {student.fullName}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {student.className}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium opacity-0 group-hover/student:opacity-100 transition-opacity">
                                        ID: {student._id?.slice(-4) || 'N/A'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <FaUserPlus className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                            Guruhda hali o'quvchilar yo'q
                        </p>
                        <button
                            onClick={() => openAddStudentModal(group)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg"
                        >
                            + O'quvchi qo'shish
                        </button>
                    </div>
                )}

                {groupStudents.length > 0 && (
                    <button
                        onClick={() => handleGroupClick(group._id)}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <FaCalendarAlt />
                        Davomatni boshqarish
                        <span className="ml-1">→</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default GroupCard;