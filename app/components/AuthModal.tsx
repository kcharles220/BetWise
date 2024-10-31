//AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '../providers/AuthContext';
import { AuthFormData, AuthResponse } from '../types';

import axios from 'axios';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSignUp: boolean;
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  isSignUp,
  onToggleMode,
}) => {
  const router = useRouter();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorQR, setTwoFactorQR] = useState<string>('');
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    twoFactorCode: '',
  });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      twoFactorCode: '',
    });
    setError('');
    setTwoFactorRequired(false);
    setVerificationRequired(false);
    setTwoFactorQR('');
  };

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!validatePassword(formData.password)) {
          setError('Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters');
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const response: AuthResponse = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          enable2FA,
        });

        if (response.requiresVerification) {
          setVerificationRequired(true);
        }

        if (response.twoFactorQR) {
          setTwoFactorQR(response.twoFactorQR);
        }
      } else {
        const response: AuthResponse = await login({
          username: formData.username,
          password: formData.password,
          twoFactorCode: formData.twoFactorCode,
        });

        if (response.requires2FA) {
          setTwoFactorRequired(true);
          setLoading(false);
          return;
        }

        if (response.requiresVerification) {
          setVerificationRequired(true);
          setLoading(false);
          return;
        }

        // Successful login
        onClose();
        router.push('');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email first');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:8080/auth/forgot-password', {
        email: formData.email,
      });
      alert('If your email is registered, you will receive password reset instructions');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-20"
      onClick={onClose}
    >
      <div className="flex items-center justify-center h-full">
        <div
          className="bg-[#2A2A2A] p-8 rounded-lg w-96 shadow-xl border-solid border-[#0092CA] border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {isSignUp ? 'Sign Up' : (twoFactorRequired ? '2FA Verification' : 'Login')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className=" absolute top-0 text-center py-4 lg:px-4">
            <div className="p-2 bg-red-800 items-center text-red-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
              <span className="flex rounded-full bg-red-500 uppercase px-2 py-1 text-xs font-bold mr-3">Error</span>
              <span className="font-semibold mr-2 text-left flex-auto">{error}</span>
            </div>
          </div>
          )}

          {verificationRequired ? (
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-4">Email Verification Required</h3>
              <p className="mb-4">Please check your email and verify your account before continuing.</p>
              <button
                className="w-full py-2 rounded bg-[#0092CA] hover:bg-[#0082B5] font-medium"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          ) : twoFactorQR ? (
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Set Up Two-Factor Authentication</h3>
              <img src={twoFactorQR} alt="2FA QR Code" className="mx-auto mb-4" />
              <p className="mb-4">Scan this QR code with your authenticator app to complete setup.</p>
              <button
                className="w-full py-2 rounded bg-[#0092CA] hover:bg-[#0082B5] font-medium"
                onClick={onClose}
              >
                Complete Setup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!twoFactorRequired ? (
                <>
                  <div>
                    <label className="block text-sm mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="w-full p-2 rounded bg-[#1E1E1E] border border-[#3A3A3A] focus:border-[#0092CA] outline-none"
                      value={formData.username}
                      onChange={handleInputChange}
                      minLength={3}
                      required
                    />
                  </div>

                  {isSignUp && (
                    <div>
                      <label className="block text-sm mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full p-2 rounded bg-[#1E1E1E] border border-[#3A3A3A] focus:border-[#0092CA] outline-none"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}

                  <div className="relative">
                    <label className="block text-sm mb-1">Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="w-full p-2 rounded bg-[#1E1E1E] border border-[#3A3A3A] focus:border-[#0092CA] outline-none"
                      value={formData.password}
                      onChange={handleInputChange}
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-8 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {isSignUp && (
                    <>
                      <div>
                        <label className="block text-sm mb-1">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="w-full p-2 rounded bg-[#1E1E1E] border border-[#3A3A3A] focus:border-[#0092CA] outline-none"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="enable2FA"
                          checked={enable2FA}
                          onChange={() => setEnable2FA(!enable2FA)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="enable2FA" className="text-sm">
                          Enable Two-Factor Authentication
                        </label>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div>
                  <label className="block text-sm mb-1">2FA Code</label>
                  <input
                    type="text"
                    name="twoFactorCode"
                    className="w-full p-2 rounded bg-[#1E1E1E] border border-[#3A3A3A] focus:border-[#0092CA] outline-none"
                    value={formData.twoFactorCode}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={6}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 rounded bg-[#0092CA] hover:bg-[#0082B5] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : (twoFactorRequired ? 'Verify' : 'Login'))}
              </button>

              {!isSignUp && !twoFactorRequired && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="w-full text-sm text-gray-400 hover:text-white mt-2"
                >
                  Forgot Password?
                </button>
              )}

              <div className="text-center text-sm text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="ml-1 text-[#0092CA] hover:text-[#0082B5]"
                >
                  {isSignUp ? 'Login' : 'Sign Up'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;