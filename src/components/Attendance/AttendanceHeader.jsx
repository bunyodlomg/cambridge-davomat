import React from "react";
import { MdToday } from "react-icons/md";

export default function AttendanceHeader({ date, setDate }) {
    return (
        <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                        Davomat Olish
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                            <MdToday className="text-blue-500" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}