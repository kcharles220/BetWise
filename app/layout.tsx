//layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers/AuthContext";
import { Inter } from 'next/font/google'
import { ThemeProvider } from "./providers/theme-provider";

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: "WiseBet",
  description: "No House Edge Betting Site",
  icons: {
    icon: '/icon.ico', // /public/icon.png

  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`antialiased ${inter.className} bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark`}
      >
          <ThemeProvider>

        <AuthProvider>
            {children}

        </AuthProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
