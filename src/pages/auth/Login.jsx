import React, { useState, useContext, useEffect } from "react";
import { FaUserTie, FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { useNotification } from "../../components/Notification";

export default function Login() {
    const { show } = useNotification();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [role, setRole] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // -------------------------------
    // TELEGRAM LOGIN
    // -------------------------------
    useEffect(() => {
        if (role !== "teacher") return;

        const container = document.getElementById("telegram-button-container");
        if (!container) return;
        container.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "cambridge_davomat_bot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");

        container.appendChild(script);

        // Global callback funksiyasi
        window.onTelegramAuth = async function (user) {
            console.log("Telegram user:", user);
            try {
                const telegramUser = {
                    telegramId: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name || "",
                    username: user.username || "",
                    avatar: user.photo_url || "",
                };

                // Tuzatilgan qism: login() chaqiriladi
                const res = await login({ role: "teacher", telegramUser });
                console.log("Login success:", res);

                show({ type: "success", message: "Teacher xush kelibsiz!" });
                navigate("/teacher");
            } catch (err) {
                console.error("Login error:", err);
                show({ type: "error", message: err.response?.data?.message || "Telegram login failed" });
            }
        };

        return () => {
            container.innerHTML = "";
            delete window.onTelegramAuth;
        };
    }, [role, login, show, navigate]);

    // -------------------------------
    // ADMIN LOGIN
    // -------------------------------
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ role: "admin", email, password });
            if (res.user.role === "superadmin") navigate("/superadmin");
            else if (res.user.role === "admin") navigate("/admin");
            else navigate("/");
        } catch (err) {
            show({ type: "error", message: err.response?.data?.message || "Login failed" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://wallpaperaccess.com/full/366398.jpg')] bg-cover bg-center">
            <div className="backdrop-blur-xl bg-white/30 w-full max-w-md p-10 rounded-3xl
                            shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col items-center">

                {/* LOGO */}
                <motion.img
                    src="/logo.png"
                    alt="Logo"
                    className="w-28 h-28 mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />

                <h1 className="text-3xl font-semibold text-white drop-shadow mb-2">Cambridge Attendance</h1>
                <p className="text-white/80 text-center mb-6">{!role ? "Kirish uchun role tanlang" : ""}</p>

                {/* ROLE SELECT */}
                {!role && (
                    <div className="flex gap-6 mb-6">
                        <button
                            onClick={() => setRole("teacher")}
                            className="flex flex-col items-center p-6 w-36 rounded-2xl bg-white/20 hover:bg-white/30
                                       backdrop-blur-md border border-white/30 text-white shadow-md cursor-pointer"
                        >
                            <FaChalkboardTeacher className="text-4xl mb-2" /> Teacher
                        </button>

                        <button
                            onClick={() => setRole("admin")}
                            className="flex flex-col items-center p-6 w-36 rounded-2xl bg-white/20 hover:bg-white/30
                                       backdrop-blur-md border border-white/30 text-white shadow-md cursor-pointer"
                        >
                            <FaUserTie className="text-4xl mb-2" /> Admin
                        </button>
                    </div>
                )}

                {/* ADMIN FORM */}
                {role === "admin" && (
                    <form className="w-full flex flex-col items-center gap-4" onSubmit={handleAdminLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/30 backdrop-blur-lg text-white focus:ring-2 focus:ring-white/70 focus:outline-none"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/30 backdrop-blur-lg text-white focus:ring-2 focus:ring-white/70 focus:outline-none"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-white/30 p-3 rounded-xl text-white font-bold border border-white/40 shadow-lg backdrop-blur-lg focus:ring-2 focus:ring-white/70 focus:outline-none"
                        >
                            Login
                        </button>
                    </form>
                )}

                {/* TEACHER TELEGRAM LOGIN BUTTON */}
                {role === "teacher" && <div id="telegram-button-container" className="w-full flex justify-center mt-4"></div>}

                {/* BACK BUTTON */}
                {role && (
                    <button
                        onClick={() => setRole(null)}
                        className="mt-6 text-white/90 underline hover:text-white"
                    >
                        Rolni o‘zgartirish
                    </button>
                )}
            </div>
        </div>
    );
}
