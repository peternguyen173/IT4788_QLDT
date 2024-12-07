import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  FlatList,
  TouchableOpacity, 
  Alert,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const TeacherClassInfo = ({ route }) => {
  const { classId } = route.params;
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
  const renderStudent = ({ item, index }) => (
    <View
      style={[styles.studentContainer,
        { backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#e6f7ff' }, // Thay đổi màu nền xen kẽ
      ]}
    >
      <Text style={styles.studentName}>
        {item.first_name} {item.last_name}
      </Text>
      <Text style={styles.studentEmail}>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin lớp học</Text>

      <View style={styles.infoContainer}>
        <Text><Text style={styles.label}>Tên lớp: </Text>{classInfo.class_name}</Text>
        <Text><Text style={styles.label}>Loại lớp: </Text>{classInfo.class_type}</Text>
        <Text><Text style={styles.label}>Giảng viên: </Text>{classInfo.lecturer_name}</Text>
        <Text><Text style={styles.label}>Ngày bắt đầu: </Text>{moment(classInfo.start_date).format("DD-MM-YYYY")}</Text>
        <Text><Text style={styles.label}>Ngày kết thúc: </Text>{moment(classInfo.end_date).format("DD-MM-YYYY")}</Text>
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
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('TeacherCheckingAttendance', { classId })}
        >
          <Text style={styles.buttonText}>Điểm danh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Assignment', { classId })}
        >
          <Text style={styles.buttonText}>Bài tập</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('TeacherCheckingAttendance', { classId })}
        >
          <Text style={styles.buttonText}>Thêm sinh viên</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('EditClass', { classId })}
        >
          <Text style={styles.buttonText}>Chỉnh sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('TeacherClassMaterial', { classId })}
        >
          <Text style={styles.buttonText}>Tài liệu lớp học</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  studentContainer: {
    flex: 1,
    marginVertical: 5,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 3,
  },
  studentEmail: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  button: {
    width: '45%',
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#6A1B9A',
  },
  secondaryButton: {
    backgroundColor: '#0288D1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    alignSelf: 'center',
    width: '50%', // Chiều rộng hợp lý
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A1B9A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  fileText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  fileListContainer: {
    maxHeight: 150,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  fileItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fileItemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  removeFileButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  removeFileButtonText: {
    color: 'white',
    fontSize: 12,
  },
});


export default TeacherClassInfo;