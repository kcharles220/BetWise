import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { format } from 'date-fns';

interface BetHistoryProps {
    isAuthenticated: boolean;
}

interface IndividualBet {
    marketId: {
        sport: string;
        competition: string;
        home_team: string;
        away_team: string;
        match_time: string;
    };
    amount: number;
    estimatedOdds: number;
    status: string;
}

interface MultipleBet {
    _id: string;
    totalAmount: number;
    estimatedTotalOdds: number;
    status: string;
    createdAt: string;
    individualBets: IndividualBet[];
}

const BetHistory = ({ isAuthenticated }: BetHistoryProps) => {
    const [betHistory, setBetHistory] = useState<MultipleBet[]>([]);
    const [expandedBets, setExpandedBets] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBetHistory = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/bets/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch bet history');
                }

                const data = await response.json();
                setBetHistory(data);
            } catch (err) {
                setError('Failed to load bet history, try refreshing the page');
                console.error('Error fetching bet history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBetHistory();
    }, [isAuthenticated]);

    const toggleBet = (betId: string) => {
        const newExpandedBets = new Set(expandedBets);
        if (expandedBets.has(betId)) {
            newExpandedBets.delete(betId);
        } else {
            newExpandedBets.add(betId);
        }
        setExpandedBets(newExpandedBets);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center text-gray-400 py-10">
                Please log in to view your bet history
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center text-gray-400 py-10">
                Loading bet history...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-10">
                {error}
            </div>
        );
    }

    if (betHistory.length === 0) {
        return (
            <div className="text-center text-gray-400 py-10">
                No bets found in your history
            </div>
        );
    }

    return (
        <div className="space-y-4 py-4">
            {betHistory.map((bet) => (
                <div
                    key={bet._id}
                    className="bg-[#1E1E1E] rounded-lg p-4 transition-all duration-200"
                >
                    {/* Summary header - always visible */}
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleBet(bet._id)}
                    >
                        <div>
                            <div className="text-sm text-gray-400">
                                {formatDate(bet.createdAt)}
                            </div>
                            <div className="font-medium">
                                Multiple Bet

                            </div>
                            <span className='text-[11px]'>
                                {bet.individualBets.length} selections
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm text-gray-400">Total Stake</div>
                                <div className="font-medium text-[#29C5F6]">
                                    ${bet.totalAmount.toFixed(2)}
                                </div>
                            </div>
                            {expandedBets.has(bet._id) ?
                                <ChevronUp className="w-5 h-5" /> :
                                <ChevronDown className="w-5 h-5" />
                            }
                        </div>
                    </div>

                    {/* Expanded details */}
                    {expandedBets.has(bet._id) && (
                        <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
                            {bet.individualBets.map((individualBet, index) => (
                                <div key={index} className="bg-[#2A2A2A] rounded p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-sm text-gray-400">
                                                {individualBet.marketId.competition}
                                            </div>
                                            <div className="font-medium">
                                                {individualBet.marketId.home_team} vs {individualBet.marketId.away_team}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {formatDate(individualBet.marketId.match_time)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">Odds</div>
                                            <div className="font-medium text-[#29C5F6]">
                                                {individualBet.estimatedOdds.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-2">
                                <div className="text-sm text-gray-400">Total Odds</div>
                                <div className="font-medium text-[#29C5F6]">
                                    {bet.estimatedTotalOdds.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-400">Potential Win</div>
                                <div className="font-medium text-[#29C5F6]">
                                    ${(bet.totalAmount * bet.estimatedTotalOdds).toFixed(2)}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-400">Status</div>
                                <div className="font-medium capitalize">
                                    {bet.status.replace('_', ' ')}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BetHistory;