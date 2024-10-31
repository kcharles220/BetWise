'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    // Get initial theme state from document class
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    setIsClientSide(true);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Update Tailwind dark mode class
    document.documentElement.classList.toggle('dark', newMode);
    
    // Save preference to cookie
    document.cookie = `theme=${newMode ? 'dark' : 'light'}; path=/; max-age=31536000`;
    
    // Save to localStorage as fallback
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Don't render anything until client-side is ready
  if (!isClientSide) {
    return null;
  }

  return (
    <div className="flex items-center justify-center p-4">
      <button 
        onClick={toggleDarkMode} 
        className="relative w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded-full shadow-inner transition-all duration-300 ease-in-out"
        aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span 
          className={`absolute top-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center
            ${isDarkMode ? 'translate-x-[calc(100%+12px)]' : 'translate-x-1'}
          `}
        >
          {isDarkMode ? (
            <Moon className="w-5 h-5 text-gray-600" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
        </span>
      </button>
    </div>
  );
};

export default DarkModeToggle;