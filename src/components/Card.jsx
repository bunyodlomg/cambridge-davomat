import React from "react";

const Card = ({ title, value, icon }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500">{title}</p>
                    <h2 className="text-2xl font-semibold">{value}</h2>
                </div>
                <div className="text-green-500 text-3xl">{icon}</div>
            </div>
        </div>
    );
};

export default Card;
