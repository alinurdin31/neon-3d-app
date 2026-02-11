/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-cyan': '#00f3ff',
                'neon-pink': '#ff00ff',
                'neon-purple': '#bc13fe',
                'neon-green': '#00ff41',
                'dark-bg': '#0a0a0a',
                'card-bg': 'rgba(255, 255, 255, 0.05)',
            },
            boxShadow: {
                'neon-cyan': '0 0 10px #00f3ff, 0 0 20px #00f3ff',
                'neon-pink': '0 0 10px #ff00ff, 0 0 20px #ff00ff',
                'neon-purple': '0 0 10px #bc13fe, 0 0 20px #bc13fe',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                'neon': ['Orbitron', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
