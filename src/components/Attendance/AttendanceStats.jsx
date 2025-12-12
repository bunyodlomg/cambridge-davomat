import React from "react";
import { MdCheckCircle, MdClear, MdAccessTime, MdPeople } from "react-icons/md";

export default function AttendanceStats({ stats }) {
    // Foizlarni hisoblash
    const getPercentage = (value) => {
        if (stats.total === 0) return 0;
        return Math.round((value / stats.total) * 100);
    };

    const presentPercentage = getPercentage(stats.present);
    const absentPercentage = getPercentage(stats.absent);
    const latePercentage = getPercentage(stats.late);

    const statsData = [
        {
            label: "Kelgan",
            value: stats.present,
            percentage: presentPercentage,
            icon: MdCheckCircle,
            gradient: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
            border: "border-green-200 dark:border-green-800/30",
            iconColor: "text-green-500 dark:text-green-400",
            textColor: "text-green-700 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            progressColor: "bg-green-500 dark:bg-green-400",
        },
        {
            label: "Kelmagan",
            value: stats.absent,
            percentage: absentPercentage,
            icon: MdClear,
            gradient: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
            border: "border-red-200 dark:border-red-800/30",
            iconColor: "text-red-500 dark:text-red-400",
            textColor: "text-red-700 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-900/30",
            progressColor: "bg-red-500 dark:bg-red-400",
        },
        {
            label: "Kechikkan",
            value: stats.late,
            percentage: latePercentage,
            icon: MdAccessTime,
            gradient: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
            border: "border-amber-200 dark:border-amber-800/30",
            iconColor: "text-amber-500 dark:text-amber-400",
            textColor: "text-amber-700 dark:text-amber-400",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
            progressColor: "bg-amber-500 dark:bg-amber-400",
        },
        {
            label: "Jami",
            value: stats.total,
            percentage: 100,
            icon: MdPeople,
            gradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
            border: "border-blue-200 dark:border-blue-800/30",
            iconColor: "text-blue-500 dark:text-blue-400",
            textColor: "text-blue-700 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            progressColor: "bg-blue-500 dark:bg-blue-400",
        },
    ];

    return (
        <div className="mb-6">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {statsData.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`bg-gradient-to-r ${stat.gradient} border ${stat.border} rounded-2xl p-5 transition-all hover:shadow-lg hover:scale-[1.02] duration-200`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        {stat.label}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </h3>
                                        {stat.label !== "Jami" && (
                                            <span className={`text-sm font-semibold ${stat.textColor}`}>
                                                {stat.percentage}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                    <Icon className={`text-2xl ${stat.iconColor}`} />
                                </div>
                            </div>

                            {/* Progress bar - faqat Jami uchun emas */}
                            {stat.label !== "Jami" && (
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full ${stat.progressColor} transition-all duration-500 ease-out rounded-full`}
                                        style={{ width: `${stat.percentage}%` }}
                                    />
                                </div>
                            )}

                            {/* O'quvchilar soni - faqat Jami uchun */}
                            {stat.label === "Jami" && (
                                <div className="mt-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Guruhda ro'yxatdan o'tgan
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Summary Bar - Umumiy davomat holati */}
            {stats.total > 0 && (
                <div className="p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <MdPeople className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Umumiy davomat holati
                            </span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {stats.total} ta o'quvchi
                        </span>
                    </div>

                    {/* Combined Progress Bar */}
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                        {presentPercentage > 0 && (
                            <div
                                className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 transition-all duration-700 ease-out flex items-center justify-center"
                                style={{ width: `${presentPercentage}%` }}
                                title={`Kelgan: ${stats.present} ta (${presentPercentage}%)`}
                            >
                                {presentPercentage >= 10 && (
                                    <span className="text-xs font-semibold text-white">
                                        {presentPercentage}%
                                    </span>
                                )}
                            </div>
                        )}
                        {absentPercentage > 0 && (
                            <div
                                className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 transition-all duration-700 ease-out flex items-center justify-center"
                                style={{ width: `${absentPercentage}%` }}
                                title={`Kelmagan: ${stats.absent} ta (${absentPercentage}%)`}
                            >
                                {absentPercentage >= 10 && (
                                    <span className="text-xs font-semibold text-white">
                                        {absentPercentage}%
                                    </span>
                                )}
                            </div>
                        )}
                        {latePercentage > 0 && (
                            <div
                                className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 transition-all duration-700 ease-out flex items-center justify-center"
                                style={{ width: `${latePercentage}%` }}
                                title={`Kechikkan: ${stats.late} ta (${latePercentage}%)`}
                            >
                                {latePercentage >= 10 && (
                                    <span className="text-xs font-semibold text-white">
                                        {latePercentage}%
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Kelgan ({stats.present})
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 rounded-full" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Kelmagan ({stats.absent})
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 rounded-full" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Kechikkan ({stats.late})
                                </span>
                            </div>
                        </div>

                        {/* Attendance Rate Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${presentPercentage >= 90
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : presentPercentage >= 70
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                            {presentPercentage >= 90 ? '✓ A\'lo' : presentPercentage >= 70 ? '⚠ O\'rta' : '✗ Past'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}