/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                'auto-1fr': 'auto 1fr',
            },
        },
    },
    plugins: [],
};
