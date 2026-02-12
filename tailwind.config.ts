import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

const config = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './vendor/laravel/jetstream/**/*.blade.php',
        './vendor/laravel/fortify/**/*.blade.php',
        './vendor/laravel/horizon/resources/views/**/*.blade.php',
        './vendor/wayfinder/**/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],
    darkMode: 'class', // Or 'media' for default
    theme: {
        extend: {
            fontFamily: {
                sans: ['Instrument Sans', ...defaultTheme.fontFamily.sans],
                'instrument-sans': ['Instrument Sans', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: '#2ECC71', // Vert principal
                    dark: '#27AE60', // Vert secondaire
                },
                accent: {
                    DEFAULT: '#D68910', // Orange chaud
                },
                gray: {
                    dark: '#212121', // Texte principal / footer
                    light: '#616161', // Texte secondaire / descriptions
                    ...colors.gray, // Keep default gray shades
                },
                white: '#ffffff',
            },
        },
    },
    plugins: [],
} satisfies Config;

export default config;
