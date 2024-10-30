//layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./components/AuthContext";



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
        className={`antialiased`}
      >
        <AuthProvider>
          {children}

        </AuthProvider>
      </body>
    </html>
  );
}
