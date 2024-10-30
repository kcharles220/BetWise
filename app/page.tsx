//page.tsx
'use client';
import { useEffect, useState } from 'react';
import { X, User } from 'lucide-react';
import { format } from 'date-fns';
import "@fontsource/poppins";
import AuthModal from './components/AuthModal';
import Image from 'next/image';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAuth } from './components/AuthContext';

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

interface TeamData {
  _id: string;
  name: string;
  country: string;
  logo_url: string;
  founded: number;
  stadium: string;
  league: string;
}

interface BetSelection {
  matchId: string;
  type: 'win' | 'draw' | 'lose';
  odds: number;
  homeTeam: string;
  awayTeam: string;
  competition: string;
}


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredMatch, setHoveredMatch] = useState<string | null>(null);
  const [featuredMatches, setFeaturedMatches] = useState<MatchData[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [teamLogos, setTeamLogos] = useState<{ [key: string]: string }>({});
  const [selectedBets, setSelectedBets] = useState<BetSelection[]>([]);
  const [betAmount, setBetAmount] = useState<number>(0);
  const { user, isAuthenticated } = useAuth();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchesResponse = await fetch('http://localhost:8080/markets');
        if (matchesResponse.headers.get("content-type")?.includes("application/json")) {
          const matches = await matchesResponse.json();
          setFeaturedMatches(matches);
        }

        const teamsResponse = await fetch('http://localhost:8080/teams');
        const teamsData: TeamData[] = await teamsResponse.json();

        const logoMap = teamsData.reduce((acc: { [key: string]: string }, team) => {
          acc[team.name] = team.logo_url;
          return acc;
        }, {});

        setTeamLogos(logoMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBetSelection = (match: MatchData, type: 'win' | 'draw' | 'lose') => {
    const existingBetIndex = selectedBets.findIndex(bet => bet.matchId === match._id);

    if (existingBetIndex !== -1) {
      // If clicking the same bet type, remove it
      if (selectedBets[existingBetIndex].type === type) {
        setSelectedBets(selectedBets.filter(bet => bet.matchId !== match._id));
        return;
      }
      // If clicking a different bet type for the same match, update it
      const newBets = [...selectedBets];
      newBets[existingBetIndex] = {
        matchId: match._id,
        type,
        odds: match.odds[type],
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        competition: match.competition
      };
      setSelectedBets(newBets);
    } else {
      // Add new bet
      setSelectedBets([...selectedBets, {
        matchId: match._id,
        type,
        odds: match.odds[type],
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        competition: match.competition
      }]);
    }
  };

  const calculateTotalOdds = () => {
    return selectedBets.reduce((acc, bet) => acc * bet.odds, 1);
  };

  const calculatePotentialWinnings = () => {
    if (betAmount) {
      return (betAmount * calculateTotalOdds()).toFixed(2);

    } else { return 0; }
  };

  const formatMatchTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, hh:mm');
    } catch {
      return dateString;
    }
  };

  const popularSports = Array.from(new Set(featuredMatches.map(match => match.sport)));
  const trendingCategories = ["Champions League", "Europa League", "Premier League", "World Cup 2024"];

  const handlePlaceBet = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const betData = {
        userId: user?.id,
        bets: selectedBets,
        totalAmount: betAmount,
        totalOdds: calculateTotalOdds(),
        potentialWinnings: Number(calculatePotentialWinnings())
      };

      const response = await fetch('http://localhost:8080/bets/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(betData)
      });

      if (!response.ok) {
        throw new Error('Failed to place bet');
      }

      // Clear bet slip after successful bet
      setSelectedBets([]);
      setBetAmount(0);

      // You might want to update user's balance here
      // Could dispatch an action or call a function from AuthContext to refresh user data

      alert('Bet placed successfully!');
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#F5F5F5] font-[Poppins]">
      {/* Header */}
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
        isAuthenticated={isAuthenticated}
        setShowAuthModal={setShowAuthModal}
      />
      {/* Main Content */}
      <main className="w-full px-5 pt-20 h-[calc(100vh-20px)] grid grid-cols-12 gap-4">
        {/* Left Column - Scrollable */}
        <aside className="col-span-3 overflow-y-auto h-full pb-8 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
  pr-1">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Trending</h2>
            <ul className="bg-[#2A2A2A] rounded-lg shadow-md">
              {trendingCategories.map((category, index) => (
                <li key={index} className="cursor-pointer transition-all pl-5 p-3 hover:bg-[#1E1E1E]">
                  {category}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Sports</h2>
            <ul className="bg-[#2A2A2A] rounded-lg shadow-md">
              {popularSports.map((sport, index) => (
                <li key={index} className="cursor-pointer transition-all pl-5 p-3 hover:bg-[#1E1E1E]">
                  {sport}
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Center Column - Scrollable */}
        <section className="col-span-6 overflow-y-auto h-full pb-8 [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
          pr-1">
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
                  <span>{formatMatchTime(match.match_time)}</span>
                </div>
                <div className="flex justify-between items-center text-center mb-4">
                  <div className="flex-1 flex items-center justify-end gap-3">
                    <span className="font-semibold">{match.home_team}</span>
                    {teamLogos[match.home_team] && (
                      <Image
                        height={45} width={45}
                        className="object-contain"
                        src={teamLogos[match.home_team]}
                        alt={`${match.home_team} logo`}
                      />
                    )}
                  </div>
                  <div className="text-[#29C5F6] mx-4">x</div>
                  <div className="flex-1 flex items-center justify-start gap-3">
                    {teamLogos[match.away_team] && (
                      <Image
                        height={45} width={45}
                        className="object-contain"
                        src={teamLogos[match.away_team]}
                        alt={`${match.away_team} logo`}
                      />
                    )}
                    <span className="font-semibold">{match.away_team}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'win' as const, label: match.home_team },
                    { type: 'draw' as const, label: 'Draw' },
                    { type: 'lose' as const, label: match.away_team }
                  ].map(({ type, label }) => {
                    const isSelected = selectedBets.some(bet => bet.matchId === match._id && bet.type === type);
                    return (
                      <button
                        key={type}
                        onClick={() => handleBetSelection(match, type)}
                        className={`py-3 rounded text-center transition-all transform hover:scale-105 font-medium
                          ${isSelected
                            ? 'bg-[#29C5F6] text-white'
                            : 'bg-[#1E1E1E] hover:bg-[#29C5F6]'
                          } ${hoveredMatch === match._id ? 'hover:shadow-lg' : ''}`}
                      >
                        <div className="text-lg font-semibold">{match.odds[type]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column - Betting Slip */}
        <aside className="col-span-3 h-full">
          <div className="bg-[#2A2A2A] rounded-lg h-[100%] flex flex-col">
            {/* Fixed header */}
            <div className="flex flex-col h-[100%] overflow-hidden">

              <div className="p-6 pb-2">
                <h2 className="text-xl font-semibold">Betting Slip</h2>
              </div>

              {/* Scrollable bets container with fixed height */}
              <div className=" overflow-auto px-6 
            [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                {selectedBets.length === 0 ? (
                  <div className="text-center text-gray-400 py-10">No bets added yet</div>
                ) : (
                  <div className="space-y-2 py-2">
                    {selectedBets.map((bet, index) => (
                      <div key={index} className="bg-[#1E1E1E] rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-sm text-gray-400">{bet.competition}</div>
                            <div className="font-medium">{bet.homeTeam} vs {bet.awayTeam}</div>
                          </div>
                          <button
                            onClick={() => setSelectedBets(bets => bets.filter((_, i) => i !== index))}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            {bet.type === 'win' ? bet.homeTeam :
                              bet.type === 'lose' ? bet.awayTeam : 'Draw'}
                          </div>
                          <div className="font-semibold text-[#29C5F6]">{bet.odds}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Fixed bottom section */}
            {selectedBets.length > 0 && (
              <div className="border-t border-[#1E1E1E] p-3">
                <div className="space-y-2">
                  <div>
                    <input
                      type="number"
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      className="w-full bg-[#1E1E1E] rounded px-3 py-2 text-white"
                      placeholder="Bet Amount"
                      min="0"
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Total Odds</span>
                    <span className="font-semibold">{calculateTotalOdds().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Potential Win</span>
                    <span className="font-semibold text-[#29C5F6]">
                      ${calculatePotentialWinnings()}
                    </span>
                  </div>

                  <button
                    onClick={handlePlaceBet}
                    disabled={betAmount <= 0 || selectedBets.length === 0}
                    className={`w-full py-2 rounded font-medium transition-all
          ${betAmount > 0 && selectedBets.length > 0
                        ? 'bg-[#29C5F6] hover:bg-[#20A7D8] text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {isAuthenticated ? 'Place Bet' : 'Login to Bet'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        isSignUp={isSignUp}
        onToggleMode={() => setIsSignUp(!isSignUp)}
      />


      {/* Footer */}
      <Footer />
    </div>
  );
}