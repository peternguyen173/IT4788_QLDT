import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity, 
  Alert,
  Modal,
  ActivityIndicator,
  Linking
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StudentClassMaterial = ({ route }) => {
  const { classId } = route.params;
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);

  const { userData } = useAuth();

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
        setIsDetailModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết tài liệu');
    }
  };

  const renderMaterialItem = ({ item }) => (
    <TouchableOpacity
      style={styles.materialItemContainer}
      onPress={() => fetchMaterialDetails(item.id)}
    >
      <Text style={styles.materialTitle}>{item.material_name}</Text>
      <Text style={styles.materialType}>{item.material_type}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={materials}
        renderItem={renderMaterialItem}
        keyExtractor={(item) => item.id}
      />

      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        {currentMaterial && (
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.closeModalButton} 
              onPress={() => setIsDetailModalVisible(false)}
            >
              <Icon name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chi tiết tài liệu</Text>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Tên tài liệu:</Text>
              <Text style={styles.detailText}>{currentMaterial.material_name}</Text>
              <Text style={styles.detailLabel}>Mô tả:</Text>
              <Text style={styles.detailText}>
                {currentMaterial.description || 'Không có mô tả'}
              </Text>
              <Text style={styles.detailLabel}>Loại tài liệu:</Text>
              <Text style={styles.detailText}>{currentMaterial.material_type}</Text>
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
                <Text style={styles.linkText}>{currentMaterial.material_link || 'Không có link'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  materialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  materialType: {
    color: '#666',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailContainer: {
    marginVertical: 10,
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
});

export default StudentClassMaterial;
