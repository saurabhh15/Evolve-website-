import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { initSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Forced to production URL to prevent localhost Connection Refused errors.
  // If you want to test the backend locally, change this to 'http://localhost:5000'
  const API_URL = 'https://evolve-website.onrender.com';

  const setupSocket = (token) => {
    const socket = initSocket(token);
    // Dispatch all socket events as window CustomEvents 
    socket.on('message_received', data => window.dispatchEvent(new CustomEvent('message_received', { detail: data })));
    socket.on('message_sent', data => window.dispatchEvent(new CustomEvent('message_sent', { detail: data })));
    socket.on('notification_received', data => window.dispatchEvent(new CustomEvent('notification_received', { detail: data })));
    socket.on('connection_request_received', data => window.dispatchEvent(new CustomEvent('connection_request_received', { detail: data })));
    socket.on('user_typing', data => window.dispatchEvent(new CustomEvent('user_typing', { detail: data })));
    socket.on('project_liked', data => window.dispatchEvent(new CustomEvent('project_liked', { detail: data })));
    socket.on('user_stop_typing', data => window.dispatchEvent(new CustomEvent('user_stop_typing', { detail: data })));
    socket.on('comment_received', data => window.dispatchEvent(new CustomEvent('comment_received', { detail: data })));
    socket.on('application_rejected', data => window.dispatchEvent(new CustomEvent('application_rejected', { detail: data })));
    socket.on('team_updated', data => window.dispatchEvent(new CustomEvent('team_updated', { detail: data })));
  };

  // 1. Check if user is logged in on refresh
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // FIRST: use localStorage (latest user)
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        try {
          const res = await axios.get(`${API_URL}/api/auth/me`);

          // UPDATE BOTH STATE + LOCALSTORAGE
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));

          setupSocket(token); // init socket after confirming user is valid
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    
    setUser(res.data.user);
    setupSocket(res.data.token); // init socket on login
    
    return res.data.user;
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    disconnectSocket(); // disconnect socket on logout
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);