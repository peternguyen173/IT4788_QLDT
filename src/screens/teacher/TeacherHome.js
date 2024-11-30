import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAuth } from '../../navigators/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons'; // Import icon library
import { useNavigation } from '@react-navigation/native';

const TeacherHome = () => {
  const { userData } = useAuth();
  const navigation = useNavigation();

  const transformGoogleDriveLink = (link) => {
    if (link?.includes('drive.google.com')) {
      const fileId = link.split('/d/')[1]?.split('/')[0];
      return `https://drive.google.com/uc?id=${fileId}`;
    }
    return link; // Return original link if not a Google Drive URL
  };

  const avatar =
      transformGoogleDriveLink(userData?.avatar) ||
      'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';

  const menuItems = [
    { title: 'Danh sách lớp học', subtitle: 'Xem danh sách các lớp học theo học kỳ', icon: 'book-outline', route: 'TeacherClassList' },
    { title: 'Tạo lớp học', subtitle: 'Tạo lớp học mới theo học kỳ', icon: 'person-add-outline', route: 'CreateClass' },
    { title: 'Bài tập', subtitle: 'Tạo bài tập, theo dõi và chấm điểm', icon: 'clipboard-outline', route: 'Assignments' },
    { title: 'Tin nhắn', subtitle: 'Gửi và nhận tin nhắn', icon: 'chatbubbles-outline', route: 'ChatScreen' },
    { title: 'Xin nghỉ học', subtitle: 'Quản lý yêu cầu nghỉ học của sinh viên', icon: 'calendar-clear-outline', route: 'ManageLeaveRequests' },
    { title: 'Thông báo', subtitle: 'Cập nhật tin tức và thông báo', icon: 'notifications-outline', route: 'Notifications' },
  ];

  return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{userData?.ho + ' ' + userData?.ten || 'No name'}</Text>
              <Text style={styles.info}>Mã giảng viên: {userData?.id || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.grid}>
            {menuItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
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
    flexGrow: 1, // Đảm bảo nội dung cuộn chiếm toàn bộ chiều cao
    justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
    alignItems: 'center', // Căn giữa nội dung theo chiều ngang
    paddingVertical: 10, // Giảm khoảng trắng dọc của toàn bộ nội dung
    paddingHorizontal: 10,
  },
  header: {
    marginTop: -130,
    flexDirection: 'row', // Hiển thị avatar và text ngang hàng
    alignItems: 'center', // Căn giữa theo chiều dọc
    justifyContent: 'center', // Căn giữa toàn bộ cụm avatar + tên theo chiều ngang
  },
  avatar: {
    width: 70, // Kích thước avatar lớn hơn
    height: 70,
    borderRadius: 35, // Hình tròn
    marginRight: 15, // Khoảng cách giữa avatar và tên
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f', // Dark red
    textAlign: 'left', // Text bên trái avatar
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'left', // Text bên trái avatar
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20, // Thêm khoảng cách giữa grid và header
  },
  menuItem: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#d32f2f',
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
    color: '#d32f2f',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});


export default TeacherHome;
