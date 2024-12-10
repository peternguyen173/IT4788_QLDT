import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/navigators/AuthProvider';
import {View, Text, ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import Login from './src/screens/auth/login';
import Register from './src/screens/auth/Register'
import StudentHome from './src/screens/student/StudentHome';
import TeacherHome from './src/screens/teacher/TeacherHome';
import MainLayout from './src/components/MainLayout';
import StudentProfile from './src/screens/student/StudentProfile';
import StudentClassList from './src/screens/student/StudentClassList';
import StudentClassInfo from './src/screens/student/StudentClassInfo';
import StudentClassMaterial from './src/screens/student/StudentClassMaterial';
import TeacherProfile from './src/screens/teacher/TeacherProfile';
import TeacherClassList from './src/screens/teacher/TeacherClassList'
import TeacherClassInfo from './src/screens/teacher/TeacherClassInfo'
import TeacherCheckingAttendance from './src/screens/teacher/TeacherCheckingAttendance'
import TeacherClassMaterial from './src/screens/teacher/TeacherClassMaterial'
import VerifyScreen from "./src/screens/auth/VerifyScreen";
import RegisterClass from "./src/screens/student/RegisterClass";
import OpenClassList from "./src/screens/student/OpenClassList";
import ClassDetail from "./src/screens/student/ClassDetail";
import CreateClass from "./src/screens/teacher/CreateClass";
import Assignments from "./src/screens/teacher/Assignments";
import EditClass from "./src/screens/teacher/EditClass";
import ErrorScreen from "./src/screens/ErrorScreen";
HomeWork from './src/screens/teacher/HomeWork';


=======
import ChatScreen from "./src/screens/student/ChatScreen";
import ConversationScreen from "./src/screens/student/ConversationScreen";
import NewConversationScreen from "./src/screens/student/NewConversationScreen";
import TeacherConversationScreen from "./src/screens/teacher/TeacherConversationScreen";
import TeacherCheckingAbsence from './src/screens/teacher/TeacherCheckingAbsence';
import Notifications from './src/screens/student/ListNotifications';
import RequestAbsence from './src/screens/student/RequestAbsence';
import SubmitExam from './src/screens/student/SubmitExam';
import DetailNotification from './src/components/DetaiINotification';
import HistoryReqAbsence from './src/screens/student/HistoryReqAbsence';
import * as Notification from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import CreateSurvey from "./src/screens/teacher/CreateSurvey";
import EditSurvey from "./src/screens/teacher/EditSurvey";
import AddStudent from "./src/screens/teacher/AddStudent";
import BTTeacher from "./src/screens/teacher/BTTeacher";
import HomeWork from "./src/screens/teacher/HomeWork";
import AssignmentList from "./src/screens/teacher/AssignmentList";
import RatingAssignment from "./src/screens/teacher/RatingAssignment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StudentClassMaterial from "./src/screens/student/StudentClassMaterial";
import TeacherClassMaterial from "./src/screens/teacher/TeacherClassMaterial";
const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedIn,setIsLoggedIn, setUserData, userData, setFcmToken, fcmToken, get_unread_notifications} = useAuth();
  // const [fcmToken, setFcmToken] = useState(null);
  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('user');
    let parsedUser = JSON.parse(user);
    setIsLoggedIn(!!token);
    setUserData(parsedUser);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);


  useEffect(() => {
    const getNotificationPermission = async () => {
      try {
        const { status } = await Notification.requestPermissionsAsync();
        if (status === 'granted') {
          console.log('Notification Permission Granted');
          const token = await Notification.getExpoPushTokenAsync();
          
          console.log('Notification Token:', token.data);
          setFcmToken(token.data);
        }
      } catch (error) {
        console.error('Notification Permission Error:', error);
      }
    };

    getNotificationPermission();
  }, []); // Empty dependency array ensures this runs only once

  Notification.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  useEffect(() => {
    const notificationListener = Notification.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
      get_unread_notifications();
    });
  
    const responseListener = Notification.addNotificationResponseReceivedListener(response => {
      console.log('Notification Clicked:', response);
    });
  
    return () => {
      Notification.removeNotificationSubscription(notificationListener);
      Notification.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        userData?.role === 'STUDENT' ? (
          <>
            <Stack.Screen name="StudentHome">
              {props => (
                <MainLayout title="Trang chủ sinh viên"
                  navigation={props.navigation}>
                  <StudentHome {...props} />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="RegisterClass">
              {props => (
                <MainLayout title="QLDT" showBackButton={true} navigation={props.navigation}>
                  <RegisterClass {...props} />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="OpenClassList">
              {props => (
                <MainLayout title="QLDT" showBackButton={true} navigation={props.navigation}>
                  <OpenClassList {...props} />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="ClassDetail">
              {props => (
                <MainLayout title="Thông tin lớp" showBackButton={true} navigation={props.navigation}>
                  <ClassDetail {...props} />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="StudentProfile">
              {props => (
                <MainLayout title="Profile" showBackButton={true} navigation={props.navigation}>
                  <StudentProfile {...props} />
                </MainLayout>
              )}
            </Stack.Screen>

            <Stack.Screen name="StudentClassMaterial">
              {props => (
                  <MainLayout title="Tài liệu" showBackButton={true} navigation={props.navigation}>
                    <StudentClassMaterial {...props} />
                  </MainLayout>
              )}
            </Stack.Screen>

            <Stack.Screen name="StudentClassList">
              {props => <MainLayout title="Danh sách lớp học" showBackButton={true} navigation={props.navigation}><StudentClassList {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="StudentClassInfo">
              {props => <MainLayout title="Thông tin lớp học" showBackButton={true} navigation={props.navigation}><StudentClassInfo {...props} /></MainLayout>}
          </Stack.Screen>
          <Stack.Screen name="StudentClassMaterial">
              {props => <MainLayout title="Tài liệu lớp học" showBackButton={true} navigation={props.navigation}><StudentClassMaterial {...props} /></MainLayout>}
          </Stack.Screen>

            </Stack.Screen>
            <Stack.Screen name="ChatScreen">
              {props => <MainLayout title="Tin nhắn" showBackButton={true} navigation={props.navigation}><ChatScreen {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="NewConversationScreen">
              {props => <MainLayout title="Tin nhắn" showBackButton={true} navigation={props.navigation}><NewConversationScreen {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="ConversationScreen">
              {props => <MainLayout title="Tin nhắn" showBackButton={true} navigation={props.navigation}><ConversationScreen {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="Notifications">
              {props => <MainLayout title="Danh sách thông báo" showBackButton={true} navigation={props.navigation}><Notifications {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="DetailNotification">
              {props => <MainLayout title="Chi tiet thong bao" showBackButton={true}  navigation={props.navigation}><DetailNotification {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="RequestAbsence">
              {props => <MainLayout title="Xin nghỉ học"  showBackButton={true} navigation={props.navigation}><RequestAbsence {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="HistoryReqAbsence">
              {props => <MainLayout title="Lịch sử xin nghỉ học"  showBackButton={true} navigation={props.navigation}><HistoryReqAbsence {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="SubmitExam">
              {props => <MainLayout title="Nop bai tap"  showBackButton={true} navigation={props.navigation}><SubmitExam {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="Assignments">
              {props => <MainLayout title="Bài tập" showBackButton={true} navigation={props.navigation}><Assignments {...props} /></MainLayout>}
            </Stack.Screen>

          </>
        ) : (
          <>
            <Stack.Screen name="TeacherHome">
              {props => (
                <MainLayout title="Trang chủ giảng viên" navigation={props.navigation}>
                  <TeacherHome {...props} />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="TeacherProfile">
              {props => (
                <MainLayout title="Profile" showBackButton={true} // Hiển thị nút quay lại
                  navigation={props.navigation}>
                  <TeacherProfile {...props} />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="AddStudent">
              {props => (
                  <MainLayout title="AddStudent" showBackButton={true} // Hiển thị nút quay lại
                              navigation={props.navigation}>
                    <AddStudent {...props} />
                  </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="BTTeacher">
              {props => (
                  <MainLayout title="BTTeacher" showBackButton={true} // Hiển thị nút quay lại
                              navigation={props.navigation}>
                    <BTTeacher {...props} />
                  </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="TeacherClassMaterial">
              {props => (
                  <MainLayout title="Tài liệu" showBackButton={true} // Hiển thị nút quay lại
                              navigation={props.navigation}>
                    <TeacherClassMaterial {...props} />
                  </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="Assignment">
              {props => <MainLayout title="Bài tập" showBackButton={true} navigation={props.navigation}><Assignments {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="RatingAssignment">
              {props => <MainLayout title="Chấm điểm" showBackButton={true} navigation={props.navigation}><RatingAssignment {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="AssignmentList">
                          {props => <MainLayout title="Bài tập" showBackButton={true} navigation={props.navigation}><AssignmentList {...props} /></MainLayout>}
                        </Stack.Screen>
<Stack.Screen name="Notifications">
              {props => <MainLayout title="Danh sách thông báo"   showBackButton={true} navigation={props.navigation}><Notifications {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="DetailNotification">
              {props => <MainLayout title="Chi tiet thong bao"  showBackButton={true} navigation={props.navigation}><DetailNotification {...props} /></MainLayout>}
            </Stack.Screen>

            <Stack.Screen name="TeacherClassList">
              {props => <MainLayout title="Danh sách lớp học" showBackButton={true} navigation={props.navigation}><TeacherClassList {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="TeacherClassInfo">
              {props => <MainLayout title="Thông tin lớp học" showBackButton={true} navigation={props.navigation}><TeacherClassInfo {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="TeacherCheckingAttendance">
              {props => <MainLayout title="Điểm danh" showBackButton={true} navigation={props.navigation}><TeacherCheckingAttendance {...props} /></MainLayout>}

            </Stack.Screen>
           
            <Stack.Screen name="CreateClass">
              {props => <MainLayout title="Tạo lớp học" showBackButton={true} // Hiển thị nút quay lại
                navigation={props.navigation}><CreateClass {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="EditClass">
              {props => <MainLayout title="Sửa lớp học" showBackButton={true} navigation={props.navigation}><EditClass {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="ChatScreen">
              {props => <MainLayout title="Tin nhắn" showBackButton={true} navigation={props.navigation}><ChatScreen {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="TeacherConversationScreen">
              {props => <MainLayout title="Tin nhắn" showBackButton={true} navigation={props.navigation}><TeacherConversationScreen {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="NewConversationScreen">
              {props => <MainLayout title="Tin nhắn" showBackButton={true} navigation={props.navigation}><NewConversationScreen {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="ConversationScreen">
              {props => <MainLayout title="Tin nhắn" showBackButton={true} navigation={props.navigation}><ConversationScreen {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="TeacherCheckingAbsence">
              {props => <MainLayout title="Danh sách xin nghỉ học"  showBackButton={true} navigation={props.navigation}><TeacherCheckingAbsence {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="CreateSurvey">
              {props => <MainLayout title="Tạo bài kiểm tra"  showBackButton={true} navigation={props.navigation}><CreateSurvey {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="EditSurvey">
              {props => <MainLayout title="Sửa bài kiểm tra"  showBackButton={true} navigation={props.navigation}><EditSurvey {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="HomeWork">
              {props => <MainLayout title="Đề bài"  showBackButton={true} navigation={props.navigation}><HomeWork {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="BTTeacher">
              {props => <MainLayout title="Bài tập" navigation={props.navigation}><BTTeacher {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="CreateSurvey">
                {props => <MainLayout title="Tạo bài kiểm tra" navigation={props.navigation}><CreateSurvey {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="EditSurvey">
                {props => <MainLayout title="Sửa bài kiểm tra" navigation={props.navigation}><EditSurvey {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="AssignmentList">
                {props => <MainLayout title="Danh sách bài nộp" navigation={props.navigation}><AssignmentList {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="RatingAssignment">
                {props => <MainLayout title="Chấm điểm" navigation={props.navigation}><RatingAssignment {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="HomeWork">
                {props => <MainLayout title="Đề bài" navigation={props.navigation}><HomeWork {...props} /></MainLayout>}
            </Stack.Screen>

          </>
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen name="ErrorScreen" component={ErrorScreen} />

        </>
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#990000',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
  },
});
