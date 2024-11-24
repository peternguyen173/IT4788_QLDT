import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../navigators/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons'; // Import icon library
import { useNavigation } from '@react-navigation/native';

const TeacherHome = () => {
  const { userData } = useAuth();
  const navigation = useNavigation();
 
  const menuItems = [
    { title: 'Danh sách lớp học', subtitle: 'Xem danh sách các lớp học theo học kỳ', icon: 'book-outline', route: 'TeacherClassList' },
    { title: 'Tạo lớp học', subtitle: 'Tạo lớp học mới theo học kỳ', icon: 'person-add-outline', route: 'CreateClass' },
    { title: 'Bài tập', subtitle: 'Tạo bài tập, theo dõi và chấm điểm', icon: 'clipboard-outline', route: 'Assignments' },
    { title: 'dsdsdsd', subtitle: 'dsdsd', icon: 'checkmark-done-outline', route: 'TeacherHome' },
    { title: 'Xin nghỉ học', subtitle: 'Quản lý yêu cầu nghỉ học của sinh viên', icon: 'calendar-clear-outline', route: 'ManageLeaveRequests' },
    { title: 'Thông báo', subtitle: 'Cập nhật tin tức và thông báo', icon: 'notifications-outline', route: 'Notifications' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.name}>{userData?.ho + " " + userData?.ten || 'No name'}</Text>
          <Text style={styles.info}>Mã giảng viên: {userData?.id || 'N/A'}</Text>
        </View>
        
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              // Mọi người sửa route ở bảng menuItems rồi bỏ comment câu dưới để navigate
              onPress={() => navigation.navigate(item.route)}
            >
              <Icon name={item.icon} size={40} color="#000" style={styles.icon} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f', // Dark red
  },
  info: {
    fontSize: 14,
    color: '#888',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '47%',  // Adjust width to fit two columns
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#d32f2f', // Border color red
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#d32f2f', // Dark red
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default TeacherHome;
