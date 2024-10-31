import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          dark: 'var(--background-dark)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          dark: 'var(--foreground-dark)',
        },
      },
    },
  },
  plugins: [],
};
export default config;