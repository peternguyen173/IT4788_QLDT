import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm loading để chờ kiểm tra trạng thái đăng nhập

  useEffect(() => {
    // Kiểm tra token trong AsyncStorage
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        console.log("sdasds",token, us)
        if (token && user) {
          setIsLoggedIn(true);
          setUserData(JSON.parse(user));
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
      } finally {
        setLoading(false); // Ngừng loading sau khi kiểm tra xong
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (data) => {
    try {
      setIsLoggedIn(true);
      setUserData(data);

      // Lưu user và token vào AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(data));
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
      }
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };

  const logout = async () => {
    try {
      setIsLoggedIn(false);
      setUserData(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
      <AuthContext.Provider value={{ isLoggedIn, userData, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
