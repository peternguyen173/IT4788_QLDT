// App.js
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/navigators/AuthProvider';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Login from './src/screens/auth/login';
import Register from './src/screens/auth/Register'
import StudentHome from './src/screens/student/StudentHome';
import TeacherHome from './src/screens/teacher/TeacherHome';
import MainLayout from './src/components/MainLayout';
import StudentProfile from './src/screens/student/StudentProfile';
import TeacherProfile from './src/screens/teacher/TeacherProfile';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedIn, userData, loading } = useAuth();


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#990000" /> 
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        userData?.role === 'STUDENT' ? (
          <>
            <Stack.Screen name="StudentHome">
              {props => (
                <MainLayout title="Trang chủ sinh viên" navigation={props.navigation}>
                  <StudentHome {...props} />
                </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="StudentProfile">
              {props => (
                <MainLayout title="Profile" navigation={props.navigation}>
                  <StudentProfile {...props} />
                </MainLayout>
              )}
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
                <MainLayout title="Profile" navigation={props.navigation}>
                  <TeacherProfile {...props} />
                </MainLayout>
              )}
            </Stack.Screen>
          </>
        )
      ) : (
        <>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
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
