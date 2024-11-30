// src/navigators/AuthProvider.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

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

  const setUnreadCount1 = async () => {
    setUnreadCount(0);
  }
  const fetchUnreadCount = async () => {
    try {
      const response = await axios.post('http://157.66.24.126:8080/it5023e/get_list_conversation', {
        token: userData.token,
        index: '0',
        count: '50', // Fetch up to 50 conversations
      });

      if (response.data.meta.code === '1000') {
        const conversations = response.data.data.conversations;

        // Calculate the total unread count
        const totalUnread = conversations.reduce((acc, conversation) => {
          const lastMessage = conversation.last_message;
          if (lastMessage && lastMessage.unread && lastMessage.sender.id != userData.id) {
            return acc + lastMessage.unread;
          }
          return acc;
        }, 0);

        setUnreadCount(totalUnread); // Update the unread count in the state
      } else {
        console.error('Error fetching conversations:', response.data.meta.message);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };
  useEffect(() => {
        if (userData) {
            fetchUnreadCount(); // Ensure unread count is fetched on every mount
        }
    }, [userData]);
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
  const markInboxAsRead = () => {
    setUnreadCount(0); // Mark all unread as read
  };

  return (
      <AuthContext.Provider value={{ isLoggedIn, userData, login, logout, loading, setUserData,markInboxAsRead, unreadCount, fetchUnreadCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
