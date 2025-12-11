import React from "react";
import { motion } from "framer-motion";

const GroupModal = ({
    editingGroup,
    newGroup,
    setNewGroup,
    subjects,
    daysList,
    handleSaveGroup,
    setShowModal,
    setEditingGroup
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="backdrop-blur-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-500 shadow-2xl rounded-2xl w-full max-w-md"
            >
                <div className="p-6">
                    <h2 className="text-2xl mb-4 font-semibold text-gray-800 dark:text-gray-100 text-center">
                        {editingGroup ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}
                    </h2>

                    <div className="space-y-4">
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            placeholder="Guruh nomi"
                            value={newGroup.name}
                            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        />

                        <select
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none"
                            value={newGroup.subject}
                            onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
                        >
                            <option value="" disabled>Fan tanlang</option>
                            {subjects.map((s, i) => (
                                <option key={i} value={s}>{s}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            placeholder="Xona raqami"
                            value={newGroup.roomNumber}
                            onChange={(e) => setNewGroup({ ...newGroup, roomNumber: e.target.value })}
                        />

                        <input
                            type="time"
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            value={newGroup.time}
                            onChange={(e) => setNewGroup({ ...newGroup, time: e.target.value })}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Dars kunlari:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {daysList.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => {
                                            if (newGroup.days.includes(day))
                                                setNewGroup({ ...newGroup, days: newGroup.days.filter(d => d !== day) });
                                            else
                                                setNewGroup({ ...newGroup, days: [...newGroup.days, day] });
                                        }}
                                        className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
                                            ${newGroup.days.includes(day)
                                                ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-600"
                                                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            }`}
                                    >
                                        {day.slice(0, 2)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => { setShowModal(false); setEditingGroup(null); }}
                            className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={handleSaveGroup}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30 transition-all"
                        >
                            Saqlash
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GroupModal;