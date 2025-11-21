import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pp-blue focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          darkMode ? 'translate-x-6' : 'translate-x-1'
        }`}
      >
        <span className="sr-only">
          {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        </span>
      </span>
      <span className={`absolute left-1 text-xs transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'opacity-100'}`}>
        🌞
      </span>
      <span className={`absolute right-1 text-xs transition-opacity duration-300 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
        🌙
      </span>
    </button>
  );
}