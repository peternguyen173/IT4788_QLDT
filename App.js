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
import StudentClassList from './src/screens/student/StudentClassList';
import StudentClassInfo from './src/screens/student/StudentClassInfo';
import TeacherProfile from './src/screens/teacher/TeacherProfile';
import TeacherClassList from './src/screens/teacher/TeacherClassList'
import TeacherClassInfo from './src/screens/teacher/TeacherClassInfo'
import TeacherCheckingAttendance from './src/screens/teacher/TeacherCheckingAttendance'
import VerifyScreen from "./src/screens/auth/VerifyScreen";
import RegisterClass from "./src/screens/student/RegisterClass";
import OpenClassList from "./src/screens/student/OpenClassList";
import ClassDetail from "./src/screens/student/ClassDetail";
import CreateClass from "./src/screens/teacher/CreateClass";
import Assignments from "./src/screens/teacher/Assignments";
import EditClass from "./src/screens/teacher/EditClass";
import ErrorScreen from "./src/screens/ErrorScreen";
import BTStudent from './src/screens/student/BTStudent';
import BTTeacher from './src/screens/teacher/BTTeacher';
import CreateSurvey from './src/screens/teacher/CreateSurvey';
import EditSurvey from './src/screens/teacher/EditSurvey';
import AssignmentList from './src/screens/teacher/AssignmentList';
import RatingAssignment from './src/screens/teacher/RatingAssignment';
import CompletedSubmission from './src/screens/student/CompletedSubmission';
import PassDueSubmission from './src/screens/student/PassDueSubmission';
import UpcomingSubmission from './src/screens/student/UpcomingSubmission';
import Submit from './src/screens/student/Submit';
import HomeWork from './src/screens/teacher/HomeWork';
import Test from './src/components/Test';

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
            <Stack.Screen name="RegisterClass">
              {props => (
                  <MainLayout title="QLDT"  navigation={props.navigation}>
                    <RegisterClass {...props} />
                  </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="OpenClassList">
              {props => (
                  <MainLayout title="QLDT" navigation={props.navigation}>
                    <OpenClassList {...props} />
                  </MainLayout>
              )}
            </Stack.Screen>
            <Stack.Screen name="ClassDetail">
              {props => (
                  <MainLayout title="Thông tin lớp" navigation={props.navigation}>
                    <ClassDetail {...props} />
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

          <Stack.Screen name="StudentClassList">
              {props => <MainLayout title="Danh sách lớp học" navigation={props.navigation}><StudentClassList {...props} /></MainLayout>}
          </Stack.Screen>
          <Stack.Screen name="StudentClassInfo">
              {props => <MainLayout title="Thông tin lớp học" navigation={props.navigation}><StudentClassInfo {...props} /></MainLayout>}
          </Stack.Screen>
          <Stack.Screen name="BTStudent">
              {props => <MainLayout title="Bài tập" navigation={props.navigation}><BTStudent {...props} /></MainLayout>}
          </Stack.Screen>
          <Stack.Screen name="CompletedSubmission">
              {props => <MainLayout title="Hoàn thành" navigation={props.navigation}><CompletedSubmission {...props} /></MainLayout>}
          </Stack.Screen>
          <Stack.Screen name="PassDueSubmission">
              {props => <MainLayout title="Quá hạn" navigation={props.navigation}><PassDueSubmission {...props} /></MainLayout>}
          </Stack.Screen>
          <Stack.Screen name="UpcomingSubmission">
              {props => <MainLayout title="Đề bài" navigation={props.navigation}><UpcomingSubmission {...props} /></MainLayout>}
          </Stack.Screen>
          <Stack.Screen name="Submit">
              {props => <MainLayout title="Nộp bài" navigation={props.navigation}><Submit {...props} /></MainLayout>}
          </Stack.Screen>
          <Stack.Screen name="Test">
              {props => <MainLayout title="Test" navigation={props.navigation}><Test {...props} /></MainLayout>}
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


          <Stack.Screen name="TeacherClassList">
              {props => <MainLayout title="Danh sách lớp học" navigation={props.navigation}><TeacherClassList {...props} /></MainLayout>}
          </Stack.Screen>
          <Stack.Screen name="TeacherClassInfo">
              {props => <MainLayout title="Thông tin lớp học" navigation={props.navigation}><TeacherClassInfo {...props} /></MainLayout>}
          </Stack.Screen>
          <Stack.Screen name="TeacherCheckingAttendance">
              {props => <MainLayout title="Điểm danh" navigation={props.navigation}><TeacherCheckingAttendance {...props} /></MainLayout>}
          </Stack.Screen>
            <Stack.Screen name="Assignment">
              {props => <MainLayout title="Bài tập" navigation={props.navigation}><Assignments {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="CreateClass">
              {props => <MainLayout title="Tạo lớp học" navigation={props.navigation}><CreateClass {...props} /></MainLayout>}
            </Stack.Screen>
            <Stack.Screen name="EditClass">
              {props => <MainLayout title="Sửa lớp học" navigation={props.navigation}><EditClass {...props} /></MainLayout>}
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
