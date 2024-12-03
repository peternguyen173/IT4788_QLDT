// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const login = (data) => {
    setIsLoggedIn(true);
    setUserData(data); // Giả sử data chứa thông tin người dùng, bao gồm cả vai trò
  };
  const updateUserData =  (updatedData) => {
    setUserData(updatedData);
  };



  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, setUserData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
