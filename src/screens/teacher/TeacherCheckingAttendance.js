import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert, 
  Switch 
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const TeacherCheckingAttendance = ({ route }) => {
  const { classId } = route.params; // Nhận classId từ route params
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceList, setAttendanceList] = useState([]);
  const { userData, logout } = useAuth();
  const navigation = useNavigation();
  const currentDate = moment().format('YYYY-MM-DD'); // Lấy ngày hiện tại
  const [className, setClassName] = useState("");
  // Fetch dữ liệu sinh viên từ API
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
      console.log(response.data);
      if (response.data && response.data.data) {
        setStudents(response.data.data.student_accounts); // Lấy danh sách sinh viên
        setClassName(response.data.data.class_name);
      }
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

  const toggleAttendance = (studentId) => {
    setAttendanceList(prevList => {
      if (prevList.includes(studentId)) {
        return prevList.filter(id => id !== studentId); // Nếu đã có trong danh sách, bỏ đi
      } else {
        return [...prevList, studentId]; // Nếu chưa có, thêm vào danh sách
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'http://157.66.24.126:8080/it5023e/take_attendance',
        {
          token: userData.token,
          class_id: classId,
          date: currentDate, // Ngày điểm danh
          attendance_list: attendanceList, // Danh sách sinh viên vắng
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
          },
        }
      );
      Alert.alert('Điểm danh', 'Điểm danh thành công!');
      console.log(response.data);
      navigation.goBack(); // Quay lại màn hình trước đó (TeacherClassInfo)
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể điểm danh. Vui lòng thử lại sau.');
    }
  };

  // Hiển thị loading nếu đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Nếu không có sinh viên trong lớp
  if (students.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Không có sinh viên trong lớp.</Text>
      </View>
    );
  }

  // Render mỗi sinh viên
  const renderStudent = ({ item }) => (
    <View style={styles.studentContainer}>
      <View style={styles.studentInfoContainer}>
        <Text style={styles.studentName}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.studentEmail}>{item.email}</Text>
      </View>
      <View style={styles.attendanceContainer}>
        <Text style={styles.checkboxLabel}>Vắng?</Text>
        <Switch
          value={attendanceList.includes(item.student_id)} // Kiểm tra sinh viên đã có trong danh sách điểm danh chưa
          onValueChange={() => toggleAttendance(item.student_id)} // Cập nhật trạng thái khi thay đổi
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ngày điểm danh: {currentDate}</Text>

      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.student_id.toString()}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Điểm danh</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={()=> navigation.navigate('TeacherCheckingAbsence',{classId:classId,className:className})} >
        <Text style={styles.buttonText}>Danh sách sinh viên xin nghỉ học</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f4f4f4', // Thêm màu nền cho đẹp
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Màu chữ đẹp hơn
  },
  studentContainer: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff', // Màu nền sáng hơn cho mỗi student
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3, // Tạo hiệu ứng shadow
    flexDirection: 'row', // Để các phần tử nằm ngang
    justifyContent: 'space-between', // Căn giữa các phần tử
    alignItems: 'center',
  },
  studentInfoContainer: {
    flex: 1, // Để phần thông tin sinh viên chiếm không gian còn lại
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
  },
  studentEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  button2: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TeacherCheckingAttendance;
