import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";


export default function StudentsTable({ students, onEdit, onDelete }) {
    const [sortField, setSortField] = useState("fullName");
    const [sortDirection, setSortDirection] = useState("asc");
    const navigate = useNavigate();

    const URL = import.meta.env.VITE_API_URL
    const studentImgURL = URL.slice(0, URL.length - 4);

    // Sortlash funksiyasi
    const sortedStudents = [...students].sort((a, b) => {
        let aValue = a[sortField] || "";
        let bValue = b[sortField] || "";

        if (typeof aValue === "object") aValue = "";
        if (typeof bValue === "object") bValue = "";

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return (
            <span className="ml-1">
                {sortDirection === "asc" ? "↑" : "↓"}
            </span>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-2xl p-5">
            {/* Responsive wrapper */}
            <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[900px] text-gray-800 dark:text-gray-200">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 font-medium text-left">
                            <th
                                className="p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-tl-xl"
                                onClick={() => handleSort("fullName")}
                            >
                                <div className="flex items-center">
                                    Ism Familiya
                                    <SortIcon field="fullName" />
                                </div>
                            </th>
                            <th
                                className="p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
                                onClick={() => handleSort("className")}
                            >
                                <div className="flex items-center">
                                    Sinf
                                    <SortIcon field="className" />
                                </div>
                            </th>
                            <th className="p-3">Yo'nalish</th>
                            <th className="p-3">Telefon</th>
                            <th className="p-3">Ota-ona tel.</th>
                            <th className="p-3">Turar joyi</th>
                            <th className="p-3 text-center">Amallar</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedStudents.map((student) => (
                            <tr
                                key={student._id}
                                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                {/* Ism Familiya */}
                                <td className="p-3 font-semibold">
                                    <div className="flex items-center gap-3">
                                        {/* Rasm qismi - o'lchami to'g'ri */}
                                        {student.image ? (
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={`${studentImgURL + student.image}`}
                                                    alt={student.fullName}
                                                    className="rounded-full w-12 h-12 object-cover border-2 border-red-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {(student.fullName || "?").charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}

                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {student.fullName || "Noma'lum"}
                                            </div>
                                            {student.birthDate && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(student.birthDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Sinf */}
                                <td className="p-3 w-24">
                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 font-medium text-sm">
                                        {student.className || "—"}
                                    </span>
                                </td>

                                {/* Yo'nalish */}
                                <td className="p-3">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {student.direction || "—"}
                                    </span>
                                </td>

                                {/* Telefon */}
                                <td className="p-3">
                                    {student.phone ? (
                                        <a
                                            href={`tel:${student.phone}`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {student.phone}
                                        </a>
                                    ) : "—"}
                                </td>

                                {/* Ota-ona telefoni */}
                                <td className="p-3">
                                    {student.parentPhone ? (
                                        <a
                                            href={`tel:${student.parentPhone}`}
                                            className="text-green-600 dark:text-green-400 hover:underline"
                                        >
                                            {student.parentPhone}
                                        </a>
                                    ) : "—"}
                                </td>

                                {/* Turar joyi */}
                                <td className="p-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${student.residence === "Maktab Yotoqxonasi"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        }`}>
                                        {student.residence === "Maktab Yotoqxonasi" ? "Yotoqxona" : "Uyda"}
                                    </span>
                                </td>

                                {/* Amallar */}
                                <td className="p-3">
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => navigate(`/students/${student._id}`)}
                                            className="px-3 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                            title="Ko'rish"
                                        >
                                            <MdVisibility size={18} />
                                        </button>

                                        <button
                                            onClick={() => onEdit(student)}
                                            className="px-3 py-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                            title="Tahrirlash"
                                        >
                                            <MdEdit size={18} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(student._id)}
                                            className="px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                            title="O'chirish"
                                        >
                                            <MdDelete size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty state */}
            {students.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        O'quvchilar topilmadi
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        O'quvchilar ro'yxati bo'sh
                    </p>
                </div>
            )}

            {/* Results count */}
            {students.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                    Jami: {students.length} ta o'quvchi • Oxirgi yangilanish: {new Date().toLocaleDateString()}
                </div>
            )}
        </div>
    );
}