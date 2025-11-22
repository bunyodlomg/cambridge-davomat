import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserTie, FaChalkboardTeacher } from "react-icons/fa";

export default function Login() {
    const { telegramLogin, loginWithPassword } = useContext(AuthContext);
    const [role, setRole] = useState(null); // admin yoki teacher
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Telegram widget faqat teacher tanlaganda ishlaydi
    useEffect(() => {
        if (!role || role !== "teacher") return;

        const container = document.getElementById("telegram-button-container");
        if (!container) return;

        container.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "cambridge_davomat_bot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-onauth", "window.onTelegramAuthCallback(user)");

        container.appendChild(script);

        window.onTelegramAuthCallback = async function (user) {
            try {
                const res = await telegramLogin({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name || "",
                    username: user.username || "",
                    photo_url: user.photo_url || "",
                    role,
                });
                alert("Telegram login muvaffaqiyatli!");
                console.log("Telegram Login success:", res);
            } catch (err) {
                console.error("Telegram Login error:", err);
                alert(err.response?.data?.message || "Telegram login failed");
            }
        };

        return () => {
            container.innerHTML = "";
            delete window.onTelegramAuthCallback;
        };
    }, [role, telegramLogin]);

    // Admin login handler
    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginWithPassword({ email, password, role });
            alert("Admin login muvaffaqiyatli!");
            console.log("Admin Login success:", res);
        } catch (err) {
            console.error("Admin Login error:", err);
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-400">
            <div className="bg-white w-full max-w-md p-12 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] flex flex-col items-center transition-transform transform hover:scale-105">
                <h1 className="text-4xl font-extrabold text-green-600 mb-4 text-center">
                    Cambridge Davomat
                </h1>
                <p p className="text-gray-500 mb-8 text-center">
                    {role == null ?
                        "Tizimga kirishdan oldin rolni tanlang"
                        : ""
                    }
                </p>

                {/* Role tanlash */}
                {!role && (
                    <div className="flex w-full justify-around mb-6">
                        <button
                            onClick={() => setRole("teacher")}
                            className="flex flex-col items-center p-5 w-32 rounded-2xl bg-gradient-to-br from-green-200 to-green-400 text-white shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
                        >
                            <FaChalkboardTeacher className="text-4xl mb-2" />
                            Teacher
                        </button>

                        <button
                            onClick={() => setRole("admin")}
                            className="flex flex-col items-center p-5 w-32 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 text-white shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
                        >
                            <FaUserTie className="text-4xl mb-2" />
                            Admin
                        </button>
                    </div>
                )}

                {/* Admin login form */}
                {role === "admin" && (
                    <form
                        className="w-full flex flex-col items-center gap-4"
                        onSubmit={handlePasswordLogin}
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            Login
                        </button>
                    </form>
                )}

                {/* Teacher Telegram login */}
                {role === "teacher" && (
                    <div
                        id="telegram-button-container"
                        className="w-full flex justify-center mt-4"
                    ></div>
                )}

                {/* Back button */}
                {role && (
                    <button
                        onClick={() => setRole(null)}
                        className="mt-6 text-green-700 underline hover:text-green-900 transition-colors"
                    >
                        Rolni o'zgartirish
                    </button>
                )}
            </div>
        </div >
    );
}
