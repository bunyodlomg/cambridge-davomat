import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";

export default function StudentFilters({ onFilter, students = [] }) {
    const [filters, setFilters] = useState({
        search: "",
        className: "",
        group: ""
    });

    const [classes, setClasses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    // Sinf nomlarini olish (9-A, 10-B)
    useEffect(() => {
        if (students.length > 0) {
            const uniqueClasses = [...new Set(students
                .map(s => s.className)
                .filter(Boolean)
                .sort((a, b) => {
                    // Natural sort: 1-A, 2-B, 9-A, 10-B
                    const aMatch = a.match(/^(\d+)/);
                    const bMatch = b.match(/^(\d+)/);
                    const aNum = aMatch ? parseInt(aMatch[1]) : 0;
                    const bNum = bMatch ? parseInt(bMatch[1]) : 0;
                    return aNum - bNum || a.localeCompare(b);
                })
            )];
            setClasses(uniqueClasses);
        }
    }, [students]);

    // Guruhlarni olish
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get("/groups");
                setGroups(res.data);
            } catch (error) {
                console.error("Guruhlarni yuklashda xatolik:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleInputChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Qidiruv uchun 300ms kechikish
        if (key === "search") {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                onFilter(newFilters);
            }, 300);
        } else {
            onFilter(newFilters);
        }
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: "",
            className: "",
            group: ""
        };
        setFilters(clearedFilters);
        onFilter(clearedFilters);
    };

    const hasActiveFilters = filters.search || filters.className || filters.group;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
            {/* Sarlavha */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Qidirish va filtrlash
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                        Filtrlarni tozalash
                    </button>
                )}
            </div>

            {/* Filtrlar - 4 ustun */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Qidiruv */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Qidirish
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Ism, telefon, manzil..."
                            value={filters.search}
                            onChange={(e) => handleInputChange("search", e.target.value)}
                            className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Sinf (9-A, 10-B) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sinf
                    </label>
                    <select
                        value={filters.className}
                        onChange={(e) => handleInputChange("className", e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Barcha sinflar</option>
                        {classes.map((className) => (
                            <option key={className} value={className}>
                                {className}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Guruh */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Guruh
                    </label>
                    <select
                        value={filters.group}
                        onChange={(e) => handleInputChange("group", e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    >
                        <option value="">Barcha guruhlar</option>
                        {groups.map((group) => (
                            <option key={group._id} value={group._id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Faol filtrlarni ko'rsatish */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Faol filtrlash:
                        </span>

                        {filters.search && (
                            <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {filters.search}
                                <button
                                    onClick={() => handleInputChange("search", "")}
                                    className="ml-1 hover:text-blue-900"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {filters.classNumber && (
                            <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v6l9-5" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l-9-5" />
                                </svg>
                                {filters.classNumber}-sinf
                                <button
                                    onClick={() => handleInputChange("classNumber", "")}
                                    className="ml-1 hover:text-green-900"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {filters.className && (
                            <span className="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {filters.className}
                                <button
                                    onClick={() => handleInputChange("className", "")}
                                    className="ml-1 hover:text-orange-900"
                                >
                                    ×
                                </button>
                            </span>
                        )}

                        {filters.group && (
                            <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {groups.find(g => g._id === filters.group)?.name || "Guruh"}
                                <button
                                    onClick={() => handleInputChange("group", "")}
                                    className="ml-1 hover:text-purple-900"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}