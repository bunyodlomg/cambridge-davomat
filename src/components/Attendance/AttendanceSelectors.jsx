import React from "react";
import { MdPerson, MdGroup, MdArrowDropDown } from "react-icons/md";

export default function AttendanceSelectors({
    isTeacher,
    selectedTeacher,
    selectedGroup,
    setShowTeacherModal,
    setShowGroupModal
}) {
    const getGroupDisplayName = (group) => {
        const studentCount = group.students?.length || 0;
        return `${group.name} (${studentCount} ta o'quvchi)`;
    };

    return (
        <div className={`grid grid-cols-1 ${isTeacher ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4 mb-6`}>
            {/* Teacher Selection Card - Faqat admin/superadmin uchun */}
            {!isTeacher && (
                <div
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedTeacher
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                    onClick={() => setShowTeacherModal(true)}
                >
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
            )}

            {/* Teacher Info Card - Faqat teacher uchun (Read-only) */}
            {isTeacher && selectedTeacher && (
                <div className="p-5 rounded-2xl border border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-600">
                    <div className="flex items-center gap-3">
                        {selectedTeacher.avatar ? (
                            <img
                                src={selectedTeacher.avatar}
                                alt={selectedTeacher.fullName}
                                className="w-14 h-14 rounded-full border-2 border-blue-300 dark:border-blue-600 object-cover"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-800/50 dark:to-blue-700/50 flex items-center justify-center border-2 border-blue-300 dark:border-blue-600">
                                <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                    {selectedTeacher.fullName?.[0] || "?"}
                                </span>
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                {selectedTeacher.fullName}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                {selectedTeacher.subjects?.slice(0, 2).map((subject, index) => (
                                    <span
                                        key={index}
                                        className="text-xs px-2 py-1 bg-blue-200 dark:bg-blue-800/40 text-blue-800 dark:text-blue-200 rounded-md font-medium"
                                    >
                                        {subject}
                                    </span>
                                ))}
                                {selectedTeacher.subjects?.length > 2 && (
                                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                        +{selectedTeacher.subjects.length - 2}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                📞 {selectedTeacher.phone}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Group Selection Card */}
            <div
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedGroup
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
                        : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                    } ${!selectedTeacher ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => selectedTeacher && setShowGroupModal(true)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
                            <MdGroup className="text-2xl text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {selectedGroup ? getGroupDisplayName(selectedGroup) : "Guruh tanlang"}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {selectedGroup
                                    ? `${selectedGroup.subject} • ${selectedGroup.roomNumber}-xona • ${selectedGroup.time}`
                                    : selectedTeacher
                                        ? "Davomat oladigan guruhni tanlang"
                                        : "Avval o'qituvchi tanlang"
                                }
                            </p>
                        </div>
                    </div>
                    {selectedTeacher && (
                        <MdArrowDropDown className="text-2xl text-gray-500 flex-shrink-0" />
                    )}
                </div>
            </div>
        </div>
    );
}