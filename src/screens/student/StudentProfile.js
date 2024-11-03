import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../navigators/AuthProvider'; // Import your AuthProvider

const Profile = () => {
  const { userData, logout } = useAuth(); // Access user data and logout function from AuthProvider

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Họ:</Text>
        <Text style={styles.infoValue}>{userData?.ho || 'N/A'}</Text>
        
        <Text style={styles.infoLabel}>Tên:</Text>
        <Text style={styles.infoValue}>{userData?.ten || 'N/A'}</Text>

        <Text style={styles.infoLabel}>Mã sinh viên:</Text>
        <Text style={styles.infoValue}>{userData?.id || 'N/A'}</Text>

        {/* Add more user info fields as needed */}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 20,
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d', // Red background for logout button
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff', // White text color
    fontSize: 16,
  },
});

export default Profile;
