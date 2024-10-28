'use client';
import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSignUp: boolean;
  onToggleMode: () => void;
}

interface AuthFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface AuthFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const AuthModal = ({ isOpen, onClose, isSignUp, onToggleMode }: AuthModalProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Form submitted', formData); // Add this for debugging

    try {
      const endpoint = isSignUp ? '/auth/register' : '/auth/login';
      const payload = isSignUp
        ? {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          enable2FA
        }
        : {
          username: formData.username,
          password: formData.password
        };

      console.log('Sending request to:', `http://localhost:8080${endpoint}`); // Add this for debugging

      const response = await axios.post(`http://localhost:8080${endpoint}`, payload);

      console.log('Response received:', response.data); // Add this for debugging

      // Store the token
      localStorage.setItem('token', response.data.token);

      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      // Close modal and redirect
      onClose();
      router.push('/'); // Using next/navigation router

    } catch (err: any) {
      console.error('Auth error:', err); // Add this for debugging
      setError(err.response?.data?.message || 'An error occurred');
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
      await axios.post('http://localhost:8080/auth/forgot-password', {
        email: formData.email
      });
      alert('Password reset instructions have been sent to your email');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = () => {
    if (isSignUp) {
      return (
        formData.username &&
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword
      );
    }
    return formData.username && formData.password;
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
          <h2 className="text-2xl font-bold mb-6">{isSignUp ? 'Sign Up' : 'Login'}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                name="username"
                className="w-full p-2 rounded bg-[#1E1E1E] border border-[#3A3A3A] focus:border-[#0092CA] outline-none"
                value={formData.username}
                onChange={handleInputChange}
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
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm">Enable 2FA</label>
                  <button
                    type="button"
                    className={`w-12 h-6 rounded-full transition-colors ${enable2FA ? 'bg-[#0092CA]' : 'bg-[#3A3A3A]'
                      }`}
                    onClick={() => setEnable2FA(!enable2FA)}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${enable2FA ? 'translate-x-7' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </>
            )}

            {error && (
              <div className="p-2 bg-red-500 bg-opacity-10 border border-red-500 rounded text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`w-full py-2 rounded font-medium transition-all ${isFormValid() && !loading
                  ? 'bg-[#0092CA] hover:bg-[#0082B5]'
                  : 'bg-[#3A3A3A] cursor-not-allowed'
                }`}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
            </button>

            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full text-sm text-[#0092CA] hover:underline"
              >
                Forgot Password?
              </button>
            )}

            <button
              type="button"
              className="w-full text-sm text-gray-400 hover:text-white"
              onClick={onToggleMode}
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </form>

          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;