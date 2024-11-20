// src/components/MainLayout.js
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Header from './Header'; // Adjust the path as necessary
import Footer from './Footer'; // Import the CustomFooter
import { useAuth } from '../navigators/AuthProvider'; 

const MainLayout = ({ title, children, navigation, onBack }) => {
  const { userData } = useAuth(); // Get user data from AuthProvider

  return (
    <SafeAreaView style={styles.container}>
      <Header title={title} onBack={onBack}/>
      <View style={styles.content}>
        {children}
      </View>
      <Footer
        onHomePress={() => {
          if (userData.role === 'LECTURER') {
            navigation.navigate('TeacherHome'); // Navigate to TeacherHome if the user is a teacher
          } else {
            navigation.navigate('StudentHome'); // Navigate to StudentHome if the user is a student
          }
        }}
        onProfilePress={() => {
          if (userData.role === 'LECTURER') {
            navigation.navigate('TeacherProfile'); // Navigate to TeacherProfile if the user is a teacher
          } else {
            navigation.navigate('StudentProfile'); // Navigate to StudentProfile if the user is a student
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default MainLayout;
