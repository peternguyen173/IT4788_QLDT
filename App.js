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


const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedIn, userData } = useAuth();

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
          <Stack.Screen name="RequestAbsence">
            {props => <MainLayout title="Xin nghỉ học" navigation={props.navigation}><RequestAbsence {...props} /></MainLayout>}
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
