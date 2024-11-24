// src/navigators/AuthProvider.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (data) => {
    setIsLoggedIn(true);
    setUserData(data);
    await AsyncStorage.setItem('token', data.token);
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUserData(null);
    await AsyncStorage.removeItem('token');
  };

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.post('http://157.66.24.126:8080/it4788/get_user_info', {
            token,
            user_id: '',
          });

          if (response.data.code === 1000) {
            const user = response.data.data;
            setUserData({
              id: user.id,
              ho: user.ho,
              ten: user.ten,
              email: user.email,
              role: user.role,
              token,
            });
            setIsLoggedIn(true);
          } else {
            await AsyncStorage.removeItem('token'); // Xóa token nếu không hợp lệ
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          await AsyncStorage.removeItem('token'); // Xóa token nếu xảy ra lỗi
        }
      }

      setLoading(false);
    };

    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
