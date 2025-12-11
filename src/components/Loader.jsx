import React from "react";

export default function Loader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center  bg-white/80 dark:bg-gray-900/80 z-50">
            <div
                className="relative"
                style={{
                    width: "70px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="rounded-full"
                        style={{
                            width: "14px",
                            height: "14px",
                            backgroundColor: "oklch(50.5% 0.213 27.518)",
                            animation: `moveUpDown 1s linear infinite`,
                            animationDelay: `${i * 0.15}s`,
                        }}
                    ></div>
                ))}

                {/* Inline keyframes */}
                <style>
                    {`
                    @keyframes moveUpDown {
                        0% { transform: translateY(0); }
                        25% { transform: translateY(-12px); }
                        50% { transform: translateY(12px); }
                        75% { transform: translateY(-12px); }
                        100% { transform: translateY(0); }
                    }
                `}
                </style>
            </div>
        </div>
    );
}
