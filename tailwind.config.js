/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
        "./index.tsx"
    ],
    theme: {
        extend: {
            colors: {
                news: {
                    bg: '#000000', // Pure Black
                    paper: '#121212', // Very dark gray
                    text: '#ffffff', // Pure White
                    muted: '#9ca3af', // Gray-400
                    accent: '#10b981', // Emerald-500
                    live: '#ef4444', // Red-500
                    border: '#27272a', // Zinc-800
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
}
