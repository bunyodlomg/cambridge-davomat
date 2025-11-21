import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { telegramLogin } = useContext(AuthContext);

  useEffect(() => {
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

    window.onTelegramAuth = async function (user) {
      try {
        const res = await telegramLogin({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name || "",
          username: user.username || "",
          photo_url: user.photo_url || "",
        });
        console.log("Login success:", res);
      } catch (err) {
        console.error("Login error:", err);
        if (err.response && err.response.status === 403) {
          alert(err.response.data.message);
        }
      }
    };

    return () => {
      container.innerHTML = "";
      delete window.onTelegramAuth;
    };
  }, [telegramLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-400">
      <div className="bg-white w-full max-w-md p-12 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col items-center transition-transform transform hover:scale-105">
        <h1 className="text-4xl font-extrabold text-green-600 mb-4">
          Cambridge Davomat
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Foydalanuvchi sifatida tizimga kirish uchun Telegram orqali login qiling
        </p>

        {/* Telegram login widget */}
        <div id="telegram-button-container"></div>
      </div>
    </div>
  );
}
