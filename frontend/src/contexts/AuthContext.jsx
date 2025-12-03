// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; 
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = 'http://localhost:3000';
  useEffect(() => {
    const recoverSession = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }

      try {
        if (storedToken) {
            const userData = await authService.getMe();
            setUser(userData); 
        }
      } catch (error) {
        console.error("Sessão inválida:", error);
        logout(); 
      } finally {
        setLoading(false);
      }
    };

    recoverSession();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      const loggedUser = data.user;
      const token = data.token;

      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(loggedUser);
      
      return data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    try {
      await authService.logout();
    } catch (error) {
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};