import React from "react";

export default function StudentCard({ student, onEdit, onDelete }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
                {/* Rasm */}
                <div className="relative">
                    {student.image ? (
                        <img
                            src={`http://localhost:5000${student.image}`}
                            alt={student.fullName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-lg">👨‍🎓</span>
                        </div>
                    )}
                </div>

                {/* Ma'lumotlar */}
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                        {student.fullName || "Noma'lum"}
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <span>🏫 {student.className || "Sinf"}</span>
                            {student.direction && (
                                <>
                                    <span>•</span>
                                    <span className="text-blue-600 dark:text-blue-400">
                                        {student.direction}
                                    </span>
                                </>
                            )}
                        </div>
                        {student.phone && (
                            <div className="mt-1">📱 {student.phone}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Guruhlar */}
            {student.groups && student.groups.length > 0 && (
                <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Guruhlar:
                        </span>
                        {student.groups.slice(0, 2).map((group, idx) => (
                            <span 
                                key={idx} 
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                            >
                                {typeof group === 'object' ? group.name : `Guruh ${idx + 1}`}
                            </span>
                        ))}
                        {student.groups.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{student.groups.length - 2}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Tugmalar */}
            <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={onEdit}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded text-sm font-medium"
                >
                    Tahrirlash
                </button>
                <button
                    onClick={onDelete}
                    className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-2 rounded text-sm font-medium"
                >
                    O'chirish
                </button>
            </div>
        </div>
    );
}