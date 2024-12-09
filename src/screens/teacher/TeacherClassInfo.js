import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import * as DocumentPicker from 'expo-document-picker';
import moment from 'moment';
import mime from 'mime';
import {useNavigation} from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const TeacherClassInfo = ({ route }) => {
  const { classId } = route.params;
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [materialType, setMaterialType] = useState('');
  const { userData, logout } = useAuth();
  const [files, setFiles] = useState([]);
  const navigation = useNavigation();
  const [className, setClassName] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const dropdownButtonRef = useRef(null);


  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const menuItems = [

    { title: 'Thêm sinh viên', icon: 'person-add-outline', onPress: () => navigation.navigate('AddStudent', { classId }) },
    { title: 'Danh sách nghỉ học', icon: 'people-outline', onPress: () => navigation.navigate('TeacherCheckingAbsence', { classId, classInfo:classInfo }) },
    { title: 'Chỉnh sửa', icon: 'settings-outline', onPress: () => navigation.navigate('EditClass', { classId }) },
    { title: 'Tài liệu lớp học', icon: 'document-text-outline', onPress: () => navigation.navigate('TeacherClassMaterial', { classId }) }

  ];

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

  const pickFile = async () => {
    if (!materialType) {
      Alert.alert('Lỗi', 'Vui lòng chọn loại tài liệu.');
      return;
    }
    let fileType = '';

    switch (materialType) {
      case 'PDF':
        fileType = 'application/pdf';
        break;
      case 'Word':
        fileType = 'application/msword';
        break;
      case 'Excel':
        fileType = 'application/vnd.ms-excel';
        break;
      case 'PowerPoint':
        fileType = 'application/vnd.ms-powerpoint';
        break;
      case 'Image':
        fileType = 'image/*';
        break;
      case 'Text':
        fileType = 'text/plain';
        break;
      case 'ZIP':
        fileType = 'application/zip';
        break;
      default:
        fileType = '*/*';
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: fileType,
        multiple: true,
      });

      if (!result.cancelled) {
        // Thêm file mới
        const newFiles = result.assets.filter(
          newFile => !files.some(existingFile => existingFile.name === newFile.name)
        );

        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể chọn tệp. Vui lòng thử lại.');
    }
  };

  const removeFile = (fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const uploadFile = async () => {
    if (files.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn tệp trước khi tải lên.');
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((item) => {
        formData.append('file', {
          uri: Platform.OS === 'android' ? item.uri : item.uri.replace('file://', ''),
          type: item.mimeType || 'application/pdf',
          name: item.name,
        });
      });
      formData.append('token', userData.token);
      formData.append('classId', classId);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('materialType', materialType);

      // Detailed axios config with timeout and full error logging
      const response = await axios.post(
        'http://157.66.24.126:8080/it5023e/upload_material',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.code === '1000') {
        Alert.alert('Thành công', "Tải lên tài liệu lớp học thành công!");
        setTitle('');
        setDescription('');
        setFiles([]);
        setMaterialType('');
        setIsModalVisible(false);
      } else {
        Alert.alert('Lỗi', response.data.message || 'Có lỗi xảy ra trong quá trình tải lên tệp.');
      }
    } catch (error) {
      // Log chi tiết lỗi
      console.error('Upload error details:', {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response ? error.response.data : 'No response',
      });

      // Thông báo lỗi cụ thể
      if (error.response) {
        // The request was made and the server responded with a status code
        Alert.alert('Lỗi', error.response.data.message || 'Lỗi từ máy chủ');
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Lỗi', 'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Something happened in setting up the request that triggered an Error
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi yêu cầu: ' + error.message);
      }
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
        {/* Visible Buttons */}
        <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('TeacherCheckingAttendance', { classId })}
        >
          <Text style={styles.buttonText}>Điểm danh</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('BTTeacher', { classId })}
        >
          <Text style={styles.buttonText}>Bài tập</Text>
        </TouchableOpacity>

        {/* Dropdown Button */}
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
          <Icon name="ellipsis-vertical" size={30} color="#333" />
        </TouchableOpacity>

        {/* Dropdown Modal */}
        <Modal
            visible={isDropdownVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={toggleDropdown}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleDropdown}>
            <View style={styles.dropdownMenu}>
              {menuItems.map((item, index) => (
                  <TouchableOpacity
                      key={index}
                      style={styles.menuItem}
                      onPress={() => {
                        item.onPress();
                        toggleDropdown(); // Close dropdown after selecting
                      }}
                  >
                    <Icon name={item.icon} size={20} color="#000" />
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* Modal hiển thị form */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Tải lên tài liệu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tiêu đề"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập mô tả"
              value={description}
              onChangeText={setDescription}
            />
            <Text style={styles.inputLabel}>Chọn loại tài liệu:</Text>
            <Picker
              selectedValue={materialType}
              onValueChange={(itemValue) => setMaterialType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Chọn loại tài liệu" value="" />
              <Picker.Item label="PDF" value="PDF" />
              <Picker.Item label="Word" value="Word" />
              <Picker.Item label="Excel" value="Excel" />
              <Picker.Item label="PowerPoint" value="PowerPoint" />
              <Picker.Item label="Hình ảnh" value="Image" />
              <Picker.Item label="Văn bản" value="Text" />
              <Picker.Item label="Tệp nén (ZIP)" value="ZIP" />
            </Picker>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={pickFile}>
              <Text style={styles.buttonText}>Chọn tệp</Text>
            </TouchableOpacity>

            {files.length > 0 && (
              <ScrollView style={styles.fileListContainer}>
                <Text style={styles.fileText}>Các tệp đã chọn:</Text>
                {files.map((item, index) => (
                  <View key={index} style={styles.fileItemContainer}>
                    <Text style={styles.fileItemText} numberOfLines={1}>{item.name}</Text>
                    <TouchableOpacity
                      onPress={() => removeFile(item.name)}
                      style={styles.removeFileButton}
                    >
                      <Text style={styles.removeFileButtonText}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={uploadFile}
                disabled={files.length === 0}
              >
                <Text style={styles.buttonText}>Tải lên</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: '42%',
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
    backgroundColor: '#3B82F6',
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

  dropdownMenu: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 5,
  },
  dropdownButton: {
    marginBottom:11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },

});


export default TeacherClassInfo;