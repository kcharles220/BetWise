// types.tsx

export interface User {
    id: string;
    username: string;
    email: string;
    balance: number;
    isVerified: boolean;
    has2FAEnabled: boolean;
    createdAt: string;
    lastLogin: string;
  }
  
  export interface AuthFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    twoFactorCode: string;
  }
  
  export interface AuthResponse {
    user: User;
    accessToken: string;
    requires2FA?: boolean;
    requiresVerification?: boolean;
    twoFactorQR?: string;
  }
  
  export interface BetSelection {
    matchId: string;
    type: 'win' | 'draw' | 'lose';
    odds: number;
    homeTeam: string;
    awayTeam: string;
    competition: string;
  }