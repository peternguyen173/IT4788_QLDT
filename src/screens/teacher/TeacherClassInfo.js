import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import { useNavigation } from '@react-navigation/native';

const TeacherClassInfo = ({ route }) => {
  const { classId } = route.params; // Nhận classId từ route params
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData, logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchClassInfo();
  }, [classId]);

  const fetchClassInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://157.66.24.126:8080/it5023e/get_class_info',
        {
          class_id: classId,
          token: userData.token,
          role: userData.role,
          account_id: userData.id,
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
          },
        }
      );
      setClassInfo(response.data.data); // Set dữ liệu lớp vào state
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        // Nếu token không hợp lệ hoặc đã hết hạn, đăng xuất
        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại.', [
          { text: 'OK', onPress: () => logout() },
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin lớp. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!classInfo) {
    return (
      <View style={styles.container}>
        <Text>Không có thông tin lớp học</Text>
      </View>
    );
  }

  // Hàm render sinh viên
  const renderStudent = ({ item }) => (
    <View style={styles.studentContainer}>
      <Text>{item.first_name} {item.last_name}</Text>
      <Text>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin lớp học</Text>

      <View style={styles.infoContainer}>
        <Text><Text style={styles.label}>Tên lớp: </Text>{classInfo.class_name}</Text>
        <Text><Text style={styles.label}>Loại lớp: </Text>{classInfo.class_type}</Text>
        <Text><Text style={styles.label}>Giảng viên: </Text>{classInfo.lecturer_name}</Text>
        <Text><Text style={styles.label}>Ngày bắt đầu: </Text>{classInfo.start_date}</Text>
        <Text><Text style={styles.label}>Ngày kết thúc: </Text>{classInfo.end_date}</Text>
        <Text><Text style={styles.label}>Trạng thái: </Text>{classInfo.status}</Text>
        <Text><Text style={styles.label}>Số sinh viên: </Text>{classInfo.student_count}</Text>
      </View>

      <Text style={styles.header}>Danh sách sinh viên</Text>
      <FlatList
        data={classInfo.student_accounts}
        renderItem={renderStudent}
        keyExtractor={(item) => item.student_id.toString()}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('TeacherCheckingAttendance', { classId })}
        >
          <Text style={styles.buttonText}>Điểm danh hôm nay</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Assignment', { classId })}
        >
          <Text style={styles.buttonText}>Bài tập</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TeacherCheckingAttendance', { classId })}
        >
          <Text style={styles.buttonText}>Thêm sinh viên</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EditClass', { classId })}
        >
          <Text style={styles.buttonText}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  studentContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TeacherClassInfo;
