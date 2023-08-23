/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                "solid-chalk": ["SolidChalk", "sans-serif"],
                "sketch-chalk": ["SketchChalk", "sans-serif"],
            },
        },
        colors: {
            // Basic
            black: "#000000",
            white: "#ffffff",
            transparent: "transparent",

            "board-green": "#071f19",
            "light-board-green": "#093d2f",
            "dark-board-green": "#031a14",
            "chalk-white": "#c2c2c2",
            "light-chalk-white": "#8a8a8a",
            "dark-chalk-white": "#575757",
            "chalk-blue": "#91b5cc",
            "light-chalk-blue": "#b5e2ff",
            "dark-chalk-blue": "#5d7585",
            "chalk-green": "#a4d8b2",
            "light-chalk-green": "#b9faca",
            "dark-chalk-green": "#739c7e",
            "chalk-pink": "#ff5e5e",
            "light-chalk-pink": "#fa7f7f",
            "dark-chalk-pink": "#bf4141",
            "chalk-yellow": "#f7e99e",
            "light-chalk-yellow": "#faf0bb",
            "dark-chalk-yellow": "#a89c5b",

            // Surface
            "card-surface-1": "#3e3329",
            "card-surface-2": "#1d2921",
        },
    },
    plugins: [],
};
