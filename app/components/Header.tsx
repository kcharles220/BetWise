// components/Header.tsx
'use client';
import { Menu, X, User, Bell, Search, Plus } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  user: {
    isLoggedIn: boolean;
    balance: number ;
  };
  isAuthenticated: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, user, isAuthenticated, setShowAuthModal }) => {
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
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-white bg-[#2A2A2A] p-2 rounded-full">
          <span>balance</span>
          <Link href="/deposit">
            <button className="p-1 bg-[#0092CA] rounded-full hover:bg-[#0082B5] transition-all">
              <Plus className="w-3 h-3" />
            </button>
          </Link>
        </div>
        <Link href="/profile">
          <button className="flex items-center justify-center bg-[#2A2A2A] hover:bg-[#353535] p-2 rounded-full transition-all">
            <User className="w-6 h-6 text-[#0092CA]" />
          </button>
        </Link>
      </div>
    );
  };

  return (
    <header className="bg-[#151515] border-b border-[#00000020] shadow-md fixed w-full top-0 z-10">
      <nav className="w-full py-2.5 px-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold transform transition-all cursor-pointer">WiseBet</h1>
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
            <a href="#" className="hover:text-[#0092CA] transition-all font-bold tracking-wide">Sports</a>
            <a href="#" className="hover:text-[#0092CA] transition-all font-bold tracking-wide">Live</a>
            <a href="#" className="hover:text-[#0092CA] transition-all font-bold tracking-wide">Ranking</a>
            <a href="#" className="hover:text-[#0092CA] transition-all font-bold tracking-wide">Battle</a>
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
            <a href="#" className="block py-2 hover:text-[#0092CA] transition-all">Sports</a>
            <a href="#" className="block py-2 hover:text-[#0092CA] transition-all">Live</a>
            <a href="#" className="block py-2 hover:text-[#0092CA] transition-all">Ranking</a>
            <a href="#" className="block py-2 hover:text-[#0092CA] transition-all">Battle</a>
            <UserSection />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
