import React, { useEffect, useState } from 'react';

export default function ThemeToggle({ className = '' }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    // Toggle theme between light and dark mode
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    // Apply saved theme from localStorage on initial render
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Theme Settings
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred theme for the site. You can switch between light and dark modes.
                </p>
            </header>

            <div className="flex items-center">
                <button
                    onClick={toggleTheme}
                    className="bg-gray-200 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 px-4 py-2 rounded-md"
                >
                    {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </div>
        </section>
    );
}
