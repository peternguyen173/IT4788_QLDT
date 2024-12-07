import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert,
  TouchableWithoutFeedback 
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const AttendanceToggle = ({ status, onToggle }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'PRESENT': return '#4CAF50'; // Green
      case 'EXCUSED_ABSENCE': return '#FFC107'; // Amber
      case 'UNEXCUSED_ABSENCE': return '#F44336'; // Red
      default: return '#9E9E9E'; // Grey
    }
  };

  const getNextStatus = () => {
    switch(status) {
      case 'PRESENT': return 'EXCUSED_ABSENCE';
      case 'EXCUSED_ABSENCE': return 'UNEXCUSED_ABSENCE';
      case 'UNEXCUSED_ABSENCE': return 'PRESENT';
      default: return 'PRESENT';
    }
  };

  const getStatusLabel = () => {
    switch(status) {
      case 'PRESENT': return 'Có mặt';
      case 'EXCUSED_ABSENCE': return 'Vắng có phép';
      case 'UNEXCUSED_ABSENCE': return 'Vắng không phép';
      default: return 'Chưa xác định';
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onToggle}>
      <View style={[styles.toggleContainer, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.toggleText}>{getStatusLabel()}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const TeacherCheckingAttendance = ({ route }) => {
  const { classId } = route.params;
  const [students, setStudents] = useState([]);
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceIds, setAttendanceIds] = useState({});
  const { userData, logout } = useAuth();
  const navigation = useNavigation();
  const currentDate = moment().format("YYYY-MM-DD");

  // Fetch dữ liệu sinh viên từ API
  useEffect(() => {
    fetchClassInfo();
  }, [classId]);

  useEffect(() => {
    if (numberOfStudents > 0) {
      fetchAttendanceList();
    }
  }, [numberOfStudents]);

  const fetchClassInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://157.66.24.126:8080/it5023e/get_class_info',
        {
          token: userData.token,
          role: userData.role,
          account_id: userData.id,
          class_id: classId,
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        const studentList = response.data.data.student_accounts;
        setStudents(studentList);
        setNumberOfStudents(studentList.length);
        
        // Initialize attendance status cho từng sv
        const initialStatus = {};
        studentList.forEach(student => {
          initialStatus[student.student_id] = 'PRESENT';
        });
        setAttendanceStatus(initialStatus);
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

  const fetchAttendanceList = async () => {
    try {
      const response = await axios.post(
        'http://157.66.24.126:8080/it5023e/get_attendance_list',
        {
          token: userData.token,
          class_id: classId,
          date: currentDate,
          pageable_request: {
            page: "0",
            page_size: numberOfStudents,
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
          },
        }
      );
      console.log("Goi danh sach diem danh");
      console.log(response.data.data.attendance_student_details);

      if (!response.data.data.attendance_student_details || response.data.data.attendance_student_details.length === 0) {
        console.log("Không có dữ liệu điểm danh cho ngày này");
        return;
      }

      if (response.data && response.data.data && response.data.data.attendance_student_details && response.data.data.attendance_student_details.length > 0) {
        // Nếu đã điểm danh trước đó, cập nhật DS điểm danh
        const existingAttendance = {};
        const existingAttendanceIds = {};
        
        response.data.data.attendance_student_details.forEach(attendance => {
          existingAttendance[attendance.student_id] = attendance.status;
          existingAttendanceIds[attendance.student_id] = attendance.attendance_id;
        });
        
        setAttendanceStatus(existingAttendance);
        setAttendanceIds(existingAttendanceIds);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("Điểm danh ngày mới nên dữ liệu điểm danh chưa có");
      }
    }
  };

  const toggleAttendanceStatus = (studentId) => {
    setAttendanceStatus(prev => {
      const currentStatus = prev[studentId];
      let newStatus;
      
      switch(currentStatus) {
        case 'PRESENT': 
          newStatus = 'EXCUSED_ABSENCE';
          break;
        case 'EXCUSED_ABSENCE':
          newStatus = 'UNEXCUSED_ABSENCE';
          break;
        case 'UNEXCUSED_ABSENCE':
          newStatus = 'PRESENT';
          break;
        default:
          newStatus = 'PRESENT';
      }
      
      return {
        ...prev,
        [studentId]: newStatus
      };
    });
  };

  const handleSubmit = async () => {
    try {
      // Danh sách sinh viên vắng không phép
      const unexcusedAbsenceList = Object.keys(attendanceStatus)
        .filter(studentId => attendanceStatus[studentId] === 'UNEXCUSED_ABSENCE');

      // Danh sách sinh viên vắng có phép
      const excusedAbsenceList = Object.keys(attendanceStatus)
        .filter(studentId => attendanceStatus[studentId] === 'EXCUSED_ABSENCE');

      // Gọi API take_attendance cho sinh viên vắng không phép
      await axios.post(
        'http://157.66.24.126:8080/it5023e/take_attendance',
        {
          token: userData.token,
          class_id: classId,
          date: currentDate,
          attendance_list: unexcusedAbsenceList,
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
          },
        }
      );

      const attendanceListResponse = await axios.post(
        'http://157.66.24.126:8080/it5023e/get_attendance_list',
        {
          token: userData.token,
          class_id: classId,
          date: currentDate,
          pageable_request: {
            page: "0",
            page_size: numberOfStudents,
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
          },
        }
      );

      // Cập nhật lại attendanceIds
      const updatedAttendanceIds = {};
      if (attendanceListResponse.data && attendanceListResponse.data.data && 
          attendanceListResponse.data.data.attendance_student_details) {
        attendanceListResponse.data.data.attendance_student_details.forEach(attendance => {
          updatedAttendanceIds[attendance.student_id] = attendance.attendance_id;
        });
      }

      // Gọi API set_attendance_status cho sinh viên vắng có phép
      for (const studentId of excusedAbsenceList) {
        const attendanceId = updatedAttendanceIds[studentId];
        if (attendanceId) {
          const response = await axios.post(
            'http://157.66.24.126:8080/it5023e/set_attendance_status',
            {
              token: userData.token,
              status: 'EXCUSED_ABSENCE',
              attendance_id: attendanceId,
            },
            {
              headers: {
                'Authorization': `Bearer ${userData.token}`,
              },
            }
          );
          console.log(response.data);
        }
      }

      Alert.alert('Điểm danh', 'Điểm danh thành công!');
      navigation.goBack();
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
  const renderStudent = ({ item }) => {
    const status = attendanceStatus[item.student_id];
    
    return (
      <View style={styles.studentContainer}>
        <View style={styles.studentInfoContainer}>
          <Text style={styles.studentName}>{item.first_name} {item.last_name}</Text>
          <Text style={styles.studentEmail}>{item.email}</Text>
        </View>
        <View style={styles.attendanceContainer}>
          <AttendanceToggle 
            status={status} 
            onToggle={() => toggleAttendanceStatus(item.student_id)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Điểm danh: {moment(currentDate).format('DD/MM/YYYY')}</Text>

      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.student_id.toString()}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Lưu điểm danh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  studentContainer: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfoContainer: {
    flex: 1,
    marginRight: 10,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
  },
  studentEmail: {
    fontSize: 14,
    color: '#666',
  },
  attendanceContainer: {
    alignItems: 'center',
  },
  toggleContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  toggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TeacherCheckingAttendance;