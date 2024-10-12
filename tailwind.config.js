import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/css/**/*.css',
    ],
    darkMode: 'class', // This enables dark mode via a class
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            backgroundImage: {
                'branded-theme': "url('/images/theme-bg.png')",
            },
            // colors: {
            //     'branded-blue': 'rgb(21, 25, 186)',
            //     'branded-blue2': 'rgb(16, 20, 132)',
            //     'gray-700': 'rgb(55, 65, 81)',
            // },
        },
    },
    plugins: [forms],
};
