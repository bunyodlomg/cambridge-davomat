import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaUserTie, FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /** ----------------------
     *  TEACHER: Telegram Login
     * ---------------------- */
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
        script.setAttribute("data-onauth", "window.onTelegramAuthCallback(user)");
        container.appendChild(script);

        window.onTelegramAuthCallback = async function (user) {
            try {
                const res = await login({ role: "teacher", telegramUser: user });
                navigate("/teacher");
            } catch (err) {
                alert(err.response?.data?.message || "Telegram login failed");
            }
        };


        return () => {
            container.innerHTML = "";
            delete window.onTelegramAuthCallback;
        };
    }, [role, login]);

    /** ----------------------
     *  ADMIN LOGIN
     * ---------------------- */
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ role: "admin", email, password });

            // Rolga qarab yo'naltirish
            if (res.user.role === "superadmin") navigate("/superadmin");
            else if (res.user.role === "admin") navigate("/admin");
            else navigate("/"); // default
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://wallpaperaccess.com/full/366398.jpg')] bg-cover bg-center">

            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="
        backdrop-blur-xl bg-white/30
        w-full max-w-md p-10 rounded-3xl
        shadow-[0_20px_50px_rgba(0,0,0,0.3)]
        border border-white/20 flex flex-col items-center
    "
            >
                {/* LOGO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center mb-6"
                >
                    <motion.img
                        src="/logo.png"
                        alt="Main Logo"
                        className="w-28 h-28 drop-shadow-xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />

                    <AnimatePresence>
                        {role === "teacher" && (
                            <motion.img
                                key="telegram"
                                src="/telegram_logo.svg"
                                alt="Telegram Logo"
                                className="w-14 h-14 mt-3"
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ type: "spring", stiffness: 120 }}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                <h1 className="text-3xl font-semibold text-white drop-shadow mt-2">
                    Cambridge Attendance
                </h1>

                <p className="text-white/80 text-center mb-8">
                    {!role ? "Kirish uchun role tanlang" : ""}
                </p>

                {/* -------- ROLE SELECT va ADMIN FORM faqat ichki container animatsiyasi -------- */}
                <div className="w-full flex flex-col items-center gap-4">
                    <AnimatePresence mode="wait">
                        {!role ? (
                            <motion.div
                                key="roles"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="flex gap-6 mb-6"
                            >
                                {/* Teacher Card */}
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setRole("teacher")}
                                    className="flex flex-col items-center p-6 w-36 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-md cursor-pointer"
                                >
                                    <FaChalkboardTeacher className="text-4xl mb-2" />
                                    Teacher
                                </motion.button>

                                {/* Admin Card */}
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setRole("admin")}
                                    className="flex flex-col items-center p-6 w-36 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-md cursor-pointer"
                                >
                                    <FaUserTie className="text-4xl mb-2" />
                                    Admin
                                </motion.button>
                            </motion.div>
                        ) : role === "admin" ? (
                            <motion.form
                                key="adminForm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="w-full flex flex-col items-center gap-4"
                                onSubmit={handleAdminLogin}
                            >
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
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="w-full bg-white/30 p-3 rounded-xl text-white font-bold border border-white/40 shadow-lg backdrop-blur-lg focus:ring-2 focus:ring-white/70 focus:outline-none"
                                >
                                    Login
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="telegramButton"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                id="telegram-button-container"
                                className="w-full flex justify-center mt-4"
                            />
                        )}
                    </AnimatePresence>

                    {/* Back */}
                    {role && (
                        <button
                            onClick={() => setRole(null)}
                            className="mt-6 text-white/90 underline hover:text-white"
                        >
                            Rolni o‘zgartirish
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
