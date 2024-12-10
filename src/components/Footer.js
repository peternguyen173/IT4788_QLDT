import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../navigators/AuthProvider';

const Footer = ({ onHomePress, onProfilePress, onInboxPress, unreadCount, onNotificationPress }) => {
  const {unreadNotifications} = useAuth();
  return (
      <View style={styles.footer}>
        <TouchableOpacity onPress={onHomePress} style={styles.footerItem}>
          <Icon name="home" size={24} color="#000" />
          <Text style={styles.footerText}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onInboxPress} style={styles.footerItem}>
          <View style={styles.iconWithBadge}>
            <Icon name="chatbubbles" size={24} color="#000" />
            {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
            )}
          </View>
          <Text style={styles.footerText}>Tin nhắn</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onProfilePress} style={styles.footerItem}>
          <Icon name="person" size={24} color="#000" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity  onPress={onNotificationPress} style={styles.footerItem}>
          <View style={styles.iconWithBadge}>
            <Icon name="notifications" size={24} color="#000" />
            {unreadNotifications > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadNotifications}</Text>
                </View>
            )}
          </View>
          <Text style={styles.footerText}>Thông báo</Text>
        </TouchableOpacity>

      </View>
  );
};


const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  iconWithBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 3,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Footer;
