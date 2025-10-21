'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthState } from '@/types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        if (storedUser && token) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call
    try {
      // In a real app, this would be an actual API call
      // For now, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const user = {
        id: 'user-' + Date.now(),
        email,
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', 'mock-token-' + Date.now());
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return { 
        success: true, 
        message: 'Login successful',
        user
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      return { success: true, message: 'Logout successful' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Logout failed' 
      };
    }
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
};