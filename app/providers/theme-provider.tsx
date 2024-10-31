'use client';
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const cookieTheme = document.cookie
      .split('; ')
      .find(row => row.startsWith('theme='))
      ?.split('=')[1];
    
    const localStorageTheme = localStorage.getItem('theme');
    
    let theme: string;
    
    if (cookieTheme === undefined) {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    } else {
      // Prioritize cookie theme, then localStorage
      theme = cookieTheme || localStorageTheme || 'dark';
    }

    console.log('Cookie Theme:', cookieTheme);
    console.log('LocalStorage Theme:', localStorageTheme);
    console.log('Final Theme:', theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return <>{children}</>;
}