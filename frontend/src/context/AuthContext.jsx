import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic URL logic so it works locally and in production without breaking
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_URL = isLocalhost ? 'http://localhost:5000' : 'https://evolve-website.onrender.com';

  // 1. Check if user is logged in on refresh
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        //  FIRST: use localStorage (latest user)
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        try {
          const res = await axios.get(`${API_URL}/api/auth/me`);

          //  UPDATE BOTH STATE + LOCALSTORAGE
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axios.defaults.headers.common["Authorization"];
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    const res = await axios.post(
      `${API_URL}/api/auth/login`,
      { email, password }
    );

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

    setUser(res.data.user);

    return res.data.user;
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);