import { createContext, useState, useEffect } from 'react';
import UserAPI from '../components/entities/User'; // Import the new User API entity

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      fetchUser(); // No need to pass token here, UserAPI.me() will get it from localStorage
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await UserAPI.me(); // Use the new UserAPI.me() method
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user with token:', error);
      localStorage.removeItem('token'); // Clear invalid token
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData);
  };

  const logout = async () => {
    await UserAPI.logout(); // Use the new UserAPI.logout() method
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};