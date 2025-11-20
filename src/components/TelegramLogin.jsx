import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function TelegramLogin() {
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
            console.log("Telegram user:", user);
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

    return <div id="telegram-button-container"></div>;
}
