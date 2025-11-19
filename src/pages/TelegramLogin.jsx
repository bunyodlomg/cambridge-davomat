import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function TelegramLogin() {
    const { telegramLogin } = useContext(AuthContext);

    useEffect(() => {
        // Telegram widget script yaratish
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "cambridge_davomat_bot"); // sizning bot username
        script.setAttribute("data-size", "large");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-onauth", "onTelegramAuth(user)"); // global function ishlaydi

        document.getElementById("telegram-button-container").appendChild(script);

        // global function yaratish
        window.onTelegramAuth = async function (user) {
            try {
                const res = await telegramLogin({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    photo_url: user.photo_url,
                });
                console.log("Telegram login successful:", res);
            } catch (err) {
                console.error("Telegram login error:", err);
            }
        };

        return () => {
            document.getElementById("telegram-button-container").innerHTML = "";
            delete window.onTelegramAuth;
        };
    }, [telegramLogin]);

    return <div id="telegram-button-container"></div>;
}
