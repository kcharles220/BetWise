// authContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshToken();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/refresh-token', {}, {
        withCredentials: true,
      });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      console.log(response.data.user)
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };
  

  const login = async (credentials: any) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', credentials, {
        withCredentials: true,
      });
      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/register', userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Obtenha o token de autenticação se necessário
      const token = localStorage.getItem('accessToken');
      
      await axios.post(
        'http://localhost:8080/auth/logout', 
        {}, 
        {
          withCredentials: true,
          headers: {
            // Inclui o token no cabeçalho, se estiver disponível
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
  
      // Limpa o token do armazenamento local
      localStorage.removeItem('accessToken');
      
      // Atualiza o estado da autenticação
      setUser(null);
      setIsAuthenticated(false);
      
      // Redireciona o usuário para a página inicial
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};