// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}", // sizning komponentlar yo'li
    ],
    darkMode: "class", // ⚡ shu qator Dark mode uchun kerak
    theme: {
        extend: {},
    },
    plugins: [],
};
