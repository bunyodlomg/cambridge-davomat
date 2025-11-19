import React, { useEffect } from "react";

export default function TelegramLogin() {
    useEffect(() => {
        // Telegram widget script yaratish
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "cambridge_davomat_bot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-onauth", "onTelegramAuth(user)"); // global function ishlaydi

        document.getElementById("telegram-button-container").appendChild(script);

        // global function yaratish
        window.onTelegramAuth = function (user) {
            alert(
                "Logged in as " +
                user.first_name +
                " " +
                (user.last_name || "") +
                " (" +
                user.id +
                (user.username ? ", @" + user.username : "") +
                ")"
            );
            // Shu yerda backend-ga POST yuborish va JWT olish mumkin
        };

        return () => {
            // Component unmount bo‘lganda script va global functionni olib tashlash
            document.getElementById("telegram-button-container").innerHTML = "";
            delete window.onTelegramAuth;
        };
    }, []);

    return <div id="telegram-button-container"></div>;
}
