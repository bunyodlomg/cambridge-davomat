import React from "react";
import { MdClear, MdSearch, MdGroup, MdPeople, MdSchedule } from "react-icons/md";
import Loader from "../Loader";

export default function GroupModal({
    groups,
    selectedGroup,
    selectedTeacher,
    searchGroup,
    setSearchGroup,
    loadingGroups,
    handleGroupSelect,
    setShowGroupModal
}) {
    const filteredGroups = groups.filter(group =>
        group.name?.toLowerCase().includes(searchGroup.toLowerCase()) ||
        group.subject?.toLowerCase().includes(searchGroup.toLowerCase()) ||
        group.roomNumber?.toString().includes(searchGroup)
    );

    const countStudentsInGroup = (group) => {
        return group.students?.length || 0;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Guruh tanlang
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                O'qituvchi: {selectedTeacher.fullName}
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
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                            selectedGroup?._id === group._id
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
    );
}