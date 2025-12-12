import React from "react";
import { Link } from "react-router-dom";
import { MdWarning } from "react-icons/md";

export default function ErrorMessage({ errorMessage, setShowGroupModal, group }) {
    console.log(group);
    return (

        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800/30 rounded-2xl">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <MdWarning className="text-2xl text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                        Diqqat!
                    </h3>
                    <p className="text-red-700 dark:text-red-400 mb-3">
                        {errorMessage}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/students"
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all text-sm"
                        >
                            O'quvchilar sahifasiga o'tish
                        </Link>
                        <Link
                            to={`/teacher/${group?.teacher?._id}`}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all text-sm"
                        >
                            Guruhga o'quvchilar qo'shish
                        </Link>
                        <button
                            onClick={() => setShowGroupModal(true)}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
                        >
                            Boshqa guruh tanlash
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}