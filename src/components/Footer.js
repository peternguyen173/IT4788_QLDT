// src/components/CustomFooter.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Change to the icon set you prefer

const Footer = ({ onHomePress, onProfilePress }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={onHomePress} style={styles.footerItem}>
        <Icon name="home" size={24} color="#000" />
        <Text style={styles.footerText}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onProfilePress} style={styles.footerItem}>
        <Icon name="person" size={24} color="#000" />
        <Text style={styles.footerText}>Profile</Text>
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
});

export default Footer;
