import React, { useState } from "react";
import { MdCheck, MdClear, MdAccessTime, MdEdit, MdClose, MdSave } from "react-icons/md";

export default function StudentCard({ student, studentImgApi, handleStatusChange }) {
    const [isEditing, setIsEditing] = useState(false);
    const [note, setNote] = useState(student.notes || "");

    const statusColors = {
        present: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        absent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        late: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        excused: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };

    const borderColors = {
        present: "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10",
        absent: "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10",
        late: "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10",
        excused: "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10",
    };

    const statusLabels = {
        present: "Keldi",
        absent: "Kelmadi",
        late: "Kechikdi",
        excused: "Sababli"
    };

    const handleSaveNote = () => {
        // Bu yerda note ni saqlash logikasi bo'lishi kerak
        // Masalan: handleStatusChange ni kengaytirish yoki yangi handler
        setIsEditing(false);
    };

    return (
        <div
            className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${borderColors[student.status]}`}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Student Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {student.student.image ? (
                        <img
                            src={`${studentImgApi}${student.student.image}`}
                            alt={student.student.fullName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 flex-shrink-0">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {student.student.fullName?.[0] || "?"}
                            </span>
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {student.student.fullName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {student.student.className}
                            </span>
                            {student.student.phone && (
                                <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-500 truncate">
                                        {student.student.phone}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Buttons and Badge */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex gap-1">
                        {["present", "absent", "late"].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(student.student._id, status)}
                                className={`p-2.5 rounded-lg transition-all ${student.status === status
                                        ? status === "present"
                                            ? "bg-green-500 text-white shadow-md shadow-green-500/30"
                                            : status === "absent"
                                                ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                                                : "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    }`}
                                title={statusLabels[status]}
                            >
                                {status === "present" && <MdCheck size={18} />}
                                {status === "absent" && <MdClear size={18} />}
                                {status === "late" && <MdAccessTime size={18} />}
                            </button>
                        ))}
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${statusColors[student.status]}`}>
                        {statusLabels[student.status]}
                    </span>
                </div>
            </div>

            {/* Additional Info */}
            {(student.arrivalTime || student.notes) && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between gap-2">
                        {student.arrivalTime && (
                            <div className="flex items-center gap-1.5 text-sm">
                                <MdAccessTime className="text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">
                                    Kelish: <span className="font-semibold text-gray-900 dark:text-white">{student.arrivalTime}</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Notes Section */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Izoh qo'shing..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="2"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveNote}
                                className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                            >
                                <MdSave size={16} />
                                Saqlash
                            </button>
                            <button
                                onClick={() => {
                                    setNote(student.notes || "");
                                    setIsEditing(false);
                                }}
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                            >
                                <MdClose size={16} />
                                Bekor
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start justify-between gap-2">
                        {student.notes ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                                💬 {student.notes}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 dark:text-gray-500 italic flex-1">
                                Izoh yo'q
                            </p>
                        )}
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                            title="Izoh qo'shish"
                        >
                            <MdEdit size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}