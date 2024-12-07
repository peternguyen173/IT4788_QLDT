import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity, 
  Alert,
  TextInput,
  Modal,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import mime from 'mime';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TeacherClassMaterial = ({ route }) => {
  const { classId } = route.params;
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  // Upload/Edit states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [files, setFiles] = useState([]);
  
  // Detail states
  const [currentMaterial, setCurrentMaterial] = useState(null);

  const { userData, logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchMaterialsList();
  }, [classId]);

  const fetchMaterialsList = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://157.66.24.126:8080/it5023e/get_material_list',
        {
          token: userData.token,
          class_id: classId,
        }
      );
      
      if (response.data.code === '1000') {
        setMaterials(response.data.data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterialDetails = async (materialId) => {
    try {
      const response = await axios.post(
        'http://157.66.24.126:8080/it5023e/get_material_info',
        {
          token: userData.token,
          material_id: materialId,
        }
      );
      
      if (response.data.code === '1000') {
        setCurrentMaterial(response.data.data);
        setTitle(response.data.data.material_name);
        setDescription(response.data.data.description || '');
        setMaterialType(response.data.data.material_type);
        setIsDetailModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết tài liệu');
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
        multiple: false,
      });
  
      if (!result.cancelled) {
        setFiles(result.assets);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể chọn tệp. Vui lòng thử lại.');
    }
  };

  const uploadMaterial = async () => {
    if (files.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn tệp trước khi tải lên.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'android' ? files[0].uri : files[0].uri.replace('file://', ''),
        type: files[0].mimeType || 'application/pdf',
        name: files[0].name,
      });
      formData.append('token', userData.token);
      formData.append('classId', classId);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('materialType', materialType);
  
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
        setIsUploadModalVisible(false);
        fetchMaterialsList();
      } else {
        Alert.alert('Lỗi', response.data.message || 'Có lỗi xảy ra trong quá trình tải lên tệp.');
      }
    } catch (error) {
      console.error('Upload error details:', error);
      Alert.alert('Lỗi', 'Không thể tải lên tài liệu');
    } finally {
        setLoading(false); // Kết thúc trạng thái loading
    }
  };

  const editMaterial = async () => {
    if (files.length === 0) {
        Alert.alert('Lỗi', 'Vui lòng chọn tệp thay thế để tải lên.');
        return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      
      formData.append('file', {
        uri: Platform.OS === 'android' ? files[0].uri : files[0].uri.replace('file://', ''),
        type: files[0].mimeType || 'application/pdf',
        name: files[0].name,
      });
      formData.append('token', userData.token);
      formData.append('materialId', currentMaterial.id);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('materialType', materialType);
  
      const response = await axios.post(
        'http://157.66.24.126:8080/it5023e/edit_material', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.data.code === '1000') {
        Alert.alert('Thành công', "Chỉnh sửa tài liệu thành công!");
        setTitle('');
        setDescription('');
        setFiles([]);
        setMaterialType('');
        setIsEditModalVisible(false);
        setIsDetailModalVisible(false);
        fetchMaterialsList();
      } else {
        Alert.alert('Lỗi', response.data.message || 'Có lỗi xảy ra trong quá trình chỉnh sửa.');
      }
    } catch (error) {
      console.error('Edit error details:', error);
      Alert.alert('Lỗi', 'Không thể chỉnh sửa tài liệu');
    } finally {
        setLoading(false); // Kết thúc trạng thái loading
    }
  };

  const deleteMaterials = async (materialIds = selectedMaterials) => {
    if (!Array.isArray(materialIds)) {
        console.error('Invalid materialIds:', materialIds);
        Alert.alert('Lỗi', 'Không có tài liệu nào được chọn để xóa.');
        return;
      }
    
    try {
      const deletePromises = materialIds.map(materialId => 
        axios.post('http://157.66.24.126:8080/it5023e/delete_material', {
          token: userData.token,
          material_id: materialId
        })
      );
  
      const results = await Promise.all(deletePromises);
      
      const successfulDeletes = results.filter(result => result.data.code === '1000');
      const failedDeletes = results.filter(result => result.data.code !== '1000');
  
      if (successfulDeletes.length > 0) {
        Alert.alert('Thành công', `Đã xóa ${successfulDeletes.length} tài liệu`);
        setSelectedMaterials([]);
        fetchMaterialsList();
      }
  
      if (failedDeletes.length > 0) {
        Alert.alert('Lỗi', `Không thể xóa ${failedDeletes.length} tài liệu`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Lỗi', 'Không thể xóa tài liệu');
    }
  };

  const renderMaterialItem = ({ item }) => {
    const isSelected = selectedMaterials.includes(item.id);
    return (
      <TouchableOpacity 
        style={[
          styles.materialItemContainer, 
          isSelected && styles.selectedMaterialItem
        ]}
        onPress={() => fetchMaterialDetails(item.id)}
      >
        <View style={styles.materialItemContent}>
          <Text style={styles.materialTitle}>{item.material_name}</Text>
          <Text style={styles.materialType}>{item.material_type}</Text>
          {isSelected && (
            <Icon 
              name="check-circle" 
              size={24} 
              color="#4CAF50" 
              style={styles.selectedIcon} 
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Nút chức năng */}
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setIsUploadModalVisible(true)}
        >
          <Icon name="upload-file" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Tải lên</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách tài liệu */}
      <FlatList
        data={materials}
        renderItem={renderMaterialItem}
        keyExtractor={(item) => item.id}
      />

      {/* Modal chi tiết tài liệu */}
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDetailModalVisible(false)}
        style={styles.fullScreenModal}
        >
        {currentMaterial && (
            <View style={styles.fullScreenModalContainer}>
            <TouchableOpacity 
                style={styles.closeModalButton} 
                onPress={() => setIsDetailModalVisible(false)}
            >
                <Icon name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Chi tiết tài liệu</Text>
            <View style={styles.detailContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tên tài liệu:</Text>
                <Text style={styles.detailText}>{currentMaterial.material_name}</Text>
                </View>
                <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mô tả:</Text>
                <Text style={styles.detailText}>
                    {currentMaterial.description || 'Không có mô tả'}
                </Text>
                </View>
                <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Loại tài liệu:</Text>
                <Text style={styles.detailText}>{currentMaterial.material_type}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Link tài liệu:</Text>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.canOpenURL(currentMaterial.material_link).then((supported) => {
                                if (supported) {
                                    Linking.openURL(currentMaterial.material_link);
                                } else {
                                    Alert.alert('Lỗi', 'Không thể mở liên kết này');
                                }
                            });
                        }}
                    >
                        <Text
                            style={[styles.detailText, styles.linkText]}
                            numberOfLines={1} // Giới hạn số dòng
                            ellipsizeMode="start" // Hiển thị "..." ở giữa
                        >
                            {currentMaterial.material_link || 'Không có link'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                onPress={() => {
                    setIsDetailModalVisible(false);
                    setIsEditModalVisible(true);
                }}
                style={[styles.modalButton, styles.editButton]}
                >
                <Icon name="edit" size={20} color="white" />
                <Text style={styles.modalButtonText}>Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => {
                    Alert.alert(
                    'Xác nhận xóa',
                    'Bạn có chắc chắn muốn xóa tài liệu này?',
                    [
                        {
                        text: 'Hủy',
                        style: 'cancel'
                        },
                        {
                        text: 'Xóa',
                        style: 'destructive',
                        onPress: () => {
                            deleteMaterials([currentMaterial.id]);
                            setIsDetailModalVisible(false);
                        }
                        }
                    ]
                    );
                }}
                style={[styles.modalButton, styles.deleteButton]}
                >
                <Icon name="delete" size={20} color="white" />
                <Text style={styles.modalButtonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
            </View>
        )}
        </Modal>

      {/* Modal chỉnh sửa tài liệu */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Chỉnh sửa tài liệu</Text>
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

            <TouchableOpacity 
              style={styles.filePickerButton} 
              onPress={pickFile}
            >
              <Text style={styles.filePickerButtonText}>Chọn tệp mới thay thế</Text>
            </TouchableOpacity>
            
            {files.length > 0 && (
              <View style={styles.selectedFileContainer}>
                <Text style={styles.selectedFileText}>
                  Đã chọn: {files[0].name}
                </Text>
                <TouchableOpacity 
                  onPress={() => setFiles([])} 
                  style={styles.removeFileButton}
                >
                  <Text style={styles.removeFileButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={editMaterial}
              >
                <Text style={styles.confirmButtonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditModalVisible(false);
                  setFiles([]);
                  setTitle('');
                  setDescription('');
                  setMaterialType('');
                }}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal tải lên tài liệu */}
      <Modal
        visible={isUploadModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsUploadModalVisible(false)}
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

            <TouchableOpacity 
              style={styles.filePickerButton} 
              onPress={pickFile}
            >
              <Text style={styles.filePickerButtonText}>Chọn tệp</Text>
            </TouchableOpacity>
            
            {files.length > 0 && (
              <View style={styles.selectedFileContainer}>
                <Text style={styles.selectedFileText}>
                  Đã chọn: {files[0].name}
                </Text>
                <TouchableOpacity 
                  onPress={() => setFiles([])} 
                  style={styles.removeFileButton}
                >
                  <Text style={styles.removeFileButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={uploadMaterial}
                disabled={files.length === 0}
              >
                <Text style={styles.confirmButtonText}>Tải lên</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsUploadModalVisible(false);
                  setFiles([]);
                  setTitle('');
                  setDescription('');
                  setMaterialType('');
                }}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
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
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A1B9A',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  materialItemContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedMaterialItem: {
    backgroundColor: '#E1F5FE',
  },
  materialItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  materialType: {
    color: '#666',
    fontSize: 14,
  },
  selectedIcon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    marginBottom: 15,
  },
  filePickerButton: {
    backgroundColor: '#0288D1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  filePickerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedFileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedFileText: {
    flex: 1,
    marginRight: 10,
  },
  removeFileButton: {
    backgroundColor: '#D32F2F',
    padding: 8,
    borderRadius: 5,
  },
  removeFileButtonText: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    width: 100,
  },
  detailText: {
    flex: 1,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    maxWidth: '80%'
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  fullScreenModal: {
    margin: 0,
  },
  fullScreenModalContainer: {
    flex: 0, // Change from flex: 1 to flex: 0
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15, // Add border radius
    margin: 50, // Add margin to create space around the modal
    maxHeight: 800, // Limit the maximum height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333', // Add a slightly softer color
  },
  detailContainer: {
    marginTop: 10, // Reduced top margin
    paddingHorizontal: 10, // Add some horizontal padding
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8, // Slightly reduced margin
    alignItems: 'flex-start', // Align items to the start
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    width: 120, // Slightly wider label column
    color: '#555', // Softer color for labels
  },
  detailText: {
    flex: 1,
    color: '#333', // Darker text color
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15, // Reduced top margin
    paddingHorizontal: 10, // Add horizontal padding
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default TeacherClassMaterial;