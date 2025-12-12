import React from "react";
import { MdClear, MdSearch, MdPerson } from "react-icons/md";

export default function TeacherModal({
    teachers,
    selectedTeacher,
    searchTeacher,
    setSearchTeacher,
    handleTeacherSelect,
    setShowTeacherModal
}) {
    const filteredTeachers = teachers.filter(teacher =>
        teacher.fullName?.toLowerCase().includes(searchTeacher.toLowerCase()) ||
        teacher.phone?.includes(searchTeacher) ||
        teacher.subjects?.some(subject =>
            subject.toLowerCase().includes(searchTeacher.toLowerCase())
        )
    );

    return (
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
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedTeacher?._id === teacher._id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                                    }`}
                                    onClick={() => handleTeacherSelect(teacher)}
                                >
                                    <div className="flex items-center gap-3">
                                        {teacher.avatar ? (
                                            <img
                                                src={teacher.avatar}
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
                                            <div className="flex flex-col gap-3">
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
                                                <span className="inline-block w-1/2 text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600">
                                                    {teacher.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}