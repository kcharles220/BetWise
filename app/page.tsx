'use client';
import { useEffect, useState } from 'react';
import { Menu, X, User, Bell, ChevronDown, Search } from 'lucide-react';

// Font import
import "@fontsource/poppins"; // Ensure to add this import in your CSS setup for font styling.
interface MatchData {
  _id: string;
  sport: string;
  competition: string;
  home_team: string;
  away_team: string;
  odds: {
    win: number;
    draw: number;
    lose: number;
  };
  match_time: string;
}
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredMatch, setHoveredMatch] = useState(null);
  const [featuredMatches, setFeaturedMatches] = useState<MatchData[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:8080/markets');
        const data = await response.json();
        console.log(data)
        setFeaturedMatches(data); // Armazena os dados recebidos no estado
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    };

    fetchMatches();
  }, []);
  

  const trendingCategories = ["Champions League", "Europa League", "Premier League", "World Cup 2024"];
  const popularSports = ["Football", "Basketball", "Tennis", "MMA", "F1"];

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#F5F5F5] font-[Poppins]">
      {/* Header */}
      <header className="bg-[#151515] border-b border-[#00000020] shadow-md fixed w-full top-0 z-50">
        <nav className="container mx-auto py-2.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-2xl font-bold transform transition-all cursor-pointer">
              BetWise
            </h1>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
              <a href="#" className="hover:text-[#0092CA] transition-all font-bold tracking-wide">Sports</a>
              <a href="#" className="hover:text-[#0092CA] transition-all font-bold tracking-wide">Live</a>
              <a href="#" className="hover:text-[#0092CA] transition-all font-bold tracking-wide">Ranking</a>
              <a href="#" className="hover:text-[#0092CA] transition-all font-bold tracking-wide">Battle</a>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button className="p-2 hover:bg-[#1E1E1E] rounded-lg transition-all transform hover:scale-105">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-[#1E1E1E] rounded-lg transition-all transform hover:scale-105">
                <Bell className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 bg-[#0092CA] hover:bg-[#0082B5] px-6 py-2 rounded-lg transition-all font-medium">
                <User className="w-4 h-4" />
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-[#222831] rounded-lg transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-4">
              <a href="#" className="block py-2 hover:text-[#0092CA] transition-all">Sports</a>
              <a href="#" className="block py-2 hover:text-[#0092CA] transition-all">Live</a>
              <a href="#" className="block py-2 hover:text-[#0092CA] transition-all">Ranking</a>
              <a href="#" className="block py-2 hover:text-[#0092CA] transition-all">Battle</a>
              <button className="w-full flex items-center justify-center gap-2 bg-[#0092CA] hover:bg-[#0082B5] px-4 py-2 rounded-lg">
                <User className="w-4 h-4" />
                Login
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto  py-20 grid grid-cols-12 gap-8 ">
        {/* Left Column */}
        <aside className="col-span-3 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">🔥Trending</h2>
            <ul className="bg-[#2A2A2A] rounded-lg  hover:shadow-lg transform hover:scale-102 transition-all cursor-pointer shadow-md">
              {trendingCategories.map((category, index) => (
                <li key={index} className="cursor-pointer transition-all pl-5 p-3 hover:bg-[#1E1E1E]">{category}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Sports</h2>
            <ul className="bg-[#2A2A2A] rounded-lg  hover:shadow-lg transform hover:scale-102 transition-all cursor-pointer shadow-md">
              {popularSports.map((sport, index) => (
                <li key={index} className="cursor-pointer transition-all pl-5 p-3 hover:bg-[#1E1E1E]">{sport}</li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Center Column */}
        <section className="col-span-6">
          <h2 className="text-xl font-semibold mb-6">Featured Matches</h2>
          <div className="space-y-6">
            {featuredMatches.map((match) => (
              <div
                key={match._id}
                className="bg-[#2A2A2A] rounded-lg p-6 hover:shadow-lg transform hover:scale-102 transition-all cursor-pointer shadow-md"
                onMouseEnter={() => setHoveredMatch(match._id)}
                onMouseLeave={() => setHoveredMatch(null)}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="font-medium">{match.sport}</div>
                  <span className="text-gray-400">{match.competition}</span>
                  <span>{match.match_time}</span>
                </div>
                <div className="flex justify-between items-center text-center mb-4">
                  <div className="flex-1 font-semibold text-lg">{match.home_team}</div>
                  <div className="text-[#29C5F6]">vs</div>
                  <div className="flex-1 font-semibold text-lg">{match.away_team}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['win', 'draw', 'lose'].map((type) => (
                    <button
                      key={type}
                      className={`bg-[#1E1E1E] hover:bg-[#29C5F6] py-3 rounded text-center transition-all transform hover:scale-105 font-medium ${hoveredMatch === match._id ? 'hover:shadow-lg' : ''}`}
                    >
                      {match.odds[type as keyof typeof match.odds]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column */}
        <aside className="col-span-3 bg-[#2A2A2A] rounded-lg p-6 divide-y">
          <h2 className="text-xl font-semibold mb-4 ">Betting Slip</h2>
          <div className="text-center text-gray-400 py-10">No bets added yet</div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-[#151515] border-t border-[#00000020] mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <ul className="space-y-2 text-sm text-[#EEEEEE80]">
                <li><a href="#" className="hover:text-[#0092CA] transition-all">Who We Are</a></li>
                <li><a href="#" className="hover:text-[#0092CA] transition-all">Contact</a></li>
                <li><a href="#" className="hover:text-[#0092CA] transition-all">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-[#0092CA] transition-all">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Customer Support</h3>
              <ul className="space-y-2 text-sm text-[#EEEEEE80]">
                <li><a href="#" className="hover:text-[#0092CA] transition-all">FAQ</a></li>
                <li><a href="#" className="hover:text-[#0092CA] transition-all">Responsible Gaming</a></li>
                <li><a href="#" className="hover:text-[#0092CA] transition-all">Betting Rules</a></li>
                <li><a href="#" className="hover:text-[#0092CA] transition-all">Live Chat</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Payment Methods</h3>
              <ul className="space-y-2 text-sm text-[#EEEEEE80]">
                <li>Bank Transfer</li>
                <li>Mobile Payment</li>
                <li>Visa/Mastercard</li>
                <li>PayPal</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-[#EEEEEE80] hover:text-[#0092CA] transition-all transform hover:scale-110">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                </a>
                <a href="#" className="text-[#EEEEEE80] hover:text-[#0092CA] transition-all transform hover:scale-110">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                </a>
                <a href="#" className="text-[#EEEEEE80] hover:text-[#0092CA] transition-all transform hover:scale-110">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z"></path></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; 2024 BetPro. Todos os direitos reservados.</p>
            <p className="mt-2">Jogue com responsabilidade. +18</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
