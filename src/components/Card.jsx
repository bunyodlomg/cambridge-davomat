import React from "react";

const Card = ({ title, value, icon }) => {
    return (
        <div className="
            bg-white dark:bg-red-800 
            p-6 rounded-2xl 
            shadow-md hover:shadow-xl 
            transition-shadow duration-300
        ">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400">{title}</p>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{value}</h2>
                </div>
                <div className="text-red-700 dark:text-white text-3xl">{icon}</div>
            </div>
        </div>
    );
};

export default Card;
