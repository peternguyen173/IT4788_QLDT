import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/navigators/AuthProvider';
import Login from './src/screens/auth/login';
import StudentHome from './src/screens/student/StudentHome';
import TeacherHome from './src/screens/teacher/TeacherHome';
import MainLayout from './src/components/MainLayout'; // Import the MainLayout
import StudentProfile from './src/screens/student/StudentProfile';
import TeacherProfile from './src/screens/teacher/TeacherProfile';
import Notifications from './src/screens/student/ListNotifications';
import RequestAbsence from './src/screens/student/RequestAbsence';
import SubmitExam from './src/screens/student/SubmitExam';
import DetailNotification from './src/components/DetaiINotification';
import * as Notification from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedIn, userData } = useAuth();
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const getNotificationPermission = async () => {
      try {
        const { status } = await Notification.requestPermissionsAsync();
        if (status === 'granted') {
          console.log('Notification Permission Granted');
          const token = await Notification.getExpoPushTokenAsync();
          setFcmToken(token.data);
          console.log('Notification Token:', token.data);
        }
      } catch (error) {
        console.error('Notification Permission Error:', error);
      }
    };

    getNotificationPermission();
  }, []); // Empty dependency array ensures this runs only once




  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        // Show the appropriate home screen based on the role after login
        userData?.role === 'STUDENT' ? (
          <>
            <Stack.Screen name="StudentHome">
              {props => <MainLayout title="Trang chủ sinh viên" navigation={props.navigation}><StudentHome {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="StudentProfile">
              {props => <MainLayout title="Profile" navigation={props.navigation}><StudentProfile {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="Notifications">
              {props => <MainLayout title="Danh sách thông báo" navigation={props.navigation}><Notifications {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="DetailNotification">
              {props => <MainLayout title="Chi tiet thong bao" navigation={props.navigation}><DetailNotification {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="RequestAbsence">
              {props => <MainLayout title="Xin nghỉ học" navigation={props.navigation}><RequestAbsence {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="SubmitExam">
              {props => <MainLayout title="Nop bai tap" navigation={props.navigation}><SubmitExam {...props} /></MainLayout>}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="TeacherHome">
              {props => <MainLayout title="Trang chủ giảng viên" navigation={props.navigation}><TeacherHome {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="TeacherProfile">
              {props => <MainLayout title="Profile" navigation={props.navigation}><TeacherProfile {...props} /></MainLayout>}
            </Stack.Screen>
          </>
        )
      ) : (
        // Show Login screen if the user is not logged in
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
