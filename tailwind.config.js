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
            gridTemplateRows: {
                'a-2': 'repeat(2, auto)',
                'a-3': 'repeat(3, auto)',
                'a-4': 'repeat(4, auto)',
                'a-5': 'repeat(5, auto)',
            },
        },
    },
    plugins: [],
};
