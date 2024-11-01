// types.tsx

export interface UserData {
    id: string;
    username: string;
    email: string;
    balance: number;
    isVerified: boolean;
    twoFactorEnabled: boolean;
    createdAt: string;
    lastLogin: string;
    activeBets: number;
  }
  
  export interface AuthFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    twoFactorCode: string;
  }
  
  export interface AuthResponse {
    user: UserData;
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