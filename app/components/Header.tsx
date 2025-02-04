// components/Header.tsx
"use client";
import { Menu, X, User, Bell, Search, Plus } from "lucide-react";
import Link from "next/link";
import { UserData } from "../types";
import { useState } from "react";
import { useAuth } from '../providers/AuthContext';
import DarkModeToggle from "./DarkModeToggle";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  user: UserData;
  isAuthenticated: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  user,
  isAuthenticated,
  setShowAuthModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const UserSection = () => {
    if (!isAuthenticated) {
      return (
        <button
          className="flex items-center gap-2 bg-[#0092CA] hover:bg-[#0082B5] px-6 py-2 rounded-lg transition-all font-medium"
          onClick={() => setShowAuthModal(true)}
        >
          <User className="w-4 h-4" />
          Login
        </button>
      );
    }

    return (
      <div className="flex items-center gap-4 ">
        <div className="flex items-center gap-2 text-black dark:text-white bg-white dark:bg-[#2A2A2A] p-2 rounded-full">
          <span className="font-semibold pl-1">{user.balance.toFixed(2)}$</span>
          <Link href="/deposit">
            <button className="p-1 bg-[#0092CA] rounded-full hover:bg-[#0082B5] transition-all">
              <Plus className="w-3 h-3" />
            </button>
          </Link>
        </div>
        <div className="relative inline-block text-left " >
          <button
            className="flex items-center justify-center bg-white dark:bg-[#2A2A2A] hover:bg-[#353535] p-2 rounded-full transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            <User className="w-6 h-6 text-black dark:text-[#0092CA]" />
          </button>

          {isOpen && (
            <div onMouseLeave={() => setIsOpen(false)}
              className={`absolute right-0 mt-2 w-48 bg-[#2A2A2A] rounded-lg shadow-md transition-transform duration-200  ${
                isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            >
              <ul className="py-2">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#353535]"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#353535]"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#353535]"
                  >
                    Help
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-[#353535]"
                    onClick={logout}
                  >
                    Logout
                  </a>
                </li>
                      <DarkModeToggle />
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <header className="bg-[#00B2FA] dark:bg-[#151515] border-b border-[#00000020] shadow-md fixed w-full top-0 z-10">
      <nav className="w-full py-2.5 px-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold transform transition-all cursor-pointer">
            WiseBet
          </h1>
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
            <a
              href="#"
              className="hover:text-black dark:hover:text-[#0092CA] transition-all font-bold tracking-wide"
            >
              Sports
            </a>
            <a
              href="#"
              className="hover:text-black dark:hover:text-[#0092CA] transition-all font-bold tracking-wide"
            >
              Live
            </a>
            <a
              href="#"
              className="hover:text-black dark:hover:text-[#0092CA] transition-all font-bold tracking-wide"
            >
              Ranking
            </a>
            <a
              href="#"
              className="hover:text-black dark:hover:text-[#0092CA] transition-all font-bold tracking-wide"
            >
              Battle
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-[#1E1E1E] rounded-lg transition-all transform hover:scale-105">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-[#1E1E1E] rounded-lg transition-all transform hover:scale-105">
              <Bell className="w-5 h-5" />
            </button>
            <UserSection />
          </div>
          <button
            className="md:hidden p-2 hover:bg-[#222831] rounded-lg transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <a
              href="#"
              className="block py-2 hover:text-[#0092CA] transition-all"
            >
              Sports
            </a>
            <a
              href="#"
              className="block py-2 hover:text-[#0092CA] transition-all"
            >
              Live
            </a>
            <a
              href="#"
              className="block py-2 hover:text-[#0092CA] transition-all"
            >
              Ranking
            </a>
            <a
              href="#"
              className="block py-2 hover:text-[#0092CA] transition-all"
            >
              Battle
            </a>
            <UserSection />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
