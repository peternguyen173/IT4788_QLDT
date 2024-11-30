import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Header = ({ title, onBack }) => {
  return (
      <View style={styles.header}>
        {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButtonContainer}>
              <Text style={styles.backButton}>◀</Text>
            </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#990000', // Red background
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#fff', // White text
  },
  backButtonContainer: {
    marginRight: 10, // Khoảng cách giữa nút và tiêu đề
  },
  backButton: {
    fontSize: 16,
    color: '#fff', // White text for back button
  },
});

export default Header;
