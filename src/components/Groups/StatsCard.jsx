import React from "react";

const StatsCard = ({ title, value, color = "blue" }) => {
    // Rang konfiguratsiyasi
    const colorConfigs = {
        blue: {
            bgFrom: "from-blue-50",
            bgTo: "to-blue-100",
            darkBgFrom: "dark:from-blue-900/20",
            darkBgTo: "dark:to-blue-800/20",
            border: "border-blue-200",
            darkBorder: "dark:border-blue-800/30",
            iconBg: "bg-blue-100",
            darkIconBg: "dark:bg-blue-900/30",
            text: "text-blue-600",
            darkText: "dark:text-blue-400",
            iconColor: "text-blue-500"
        },
        indigo: {
            bgFrom: "from-indigo-50",
            bgTo: "to-indigo-100",
            darkBgFrom: "dark:from-indigo-900/20",
            darkBgTo: "dark:to-indigo-800/20",
            border: "border-indigo-200",
            darkBorder: "dark:border-indigo-800/30",
            iconBg: "bg-indigo-100",
            darkIconBg: "dark:bg-indigo-900/30",
            text: "text-indigo-600",
            darkText: "dark:text-indigo-400",
            iconColor: "text-indigo-500"
        },
        purple: {
            bgFrom: "from-purple-50",
            bgTo: "to-purple-100",
            darkBgFrom: "dark:from-purple-900/20",
            darkBgTo: "dark:to-purple-800/20",
            border: "border-purple-200",
            darkBorder: "dark:border-purple-800/30",
            iconBg: "bg-purple-100",
            darkIconBg: "dark:bg-purple-900/30",
            text: "text-purple-600",
            darkText: "dark:text-purple-400",
            iconColor: "text-purple-500"
        },
        emerald: {
            bgFrom: "from-emerald-50",
            bgTo: "to-emerald-100",
            darkBgFrom: "dark:from-emerald-900/20",
            darkBgTo: "dark:to-emerald-800/20",
            border: "border-emerald-200",
            darkBorder: "dark:border-emerald-800/30",
            iconBg: "bg-emerald-100",
            darkIconBg: "dark:bg-emerald-900/30",
            text: "text-emerald-600",
            darkText: "dark:text-emerald-400",
            iconColor: "text-emerald-500"
        },
        amber: {
            bgFrom: "from-amber-50",
            bgTo: "to-amber-100",
            darkBgFrom: "dark:from-amber-900/20",
            darkBgTo: "dark:to-amber-800/20",
            border: "border-amber-200",
            darkBorder: "dark:border-amber-800/30",
            iconBg: "bg-amber-100",
            darkIconBg: "dark:bg-amber-900/30",
            text: "text-amber-600",
            darkText: "dark:text-amber-400",
            iconColor: "text-amber-500"
        }
    };

    const config = colorConfigs[color] || colorConfigs.blue;

    return (
        <div className={`bg-gradient-to-r ${config.bgFrom} ${config.bgTo} ${config.darkBgFrom} ${config.darkBgTo} border ${config.border} ${config.darkBorder} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-3">
                <div className={`p-3 ${config.iconBg} ${config.darkIconBg} rounded-xl`}>
                    <div className={`w-6 h-6 ${config.iconColor}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0H21m-4.5 0H16m4.5 0h.008v.008h-.008V21zm-9 0h.008v.008H12V21z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
                    <p className={`text-2xl font-bold ${config.text} ${config.darkText} mt-1`}>
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;