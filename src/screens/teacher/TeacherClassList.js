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
import moment from 'moment';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons';

const TeacherClassList = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData, logout } = useAuth();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://160.30.168.228:8080/it5023e/get_class_list', // Endpoint có thể khác
        {
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
      setClasses(response.data.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        // Nếu token không hợp lệ hoặc đã hết hạn, đăng xuất
        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại.', [
          { text: 'OK', onPress: () => logout() },
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể tải danh sách lớp. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderClassItem = ({ item }) => {
    const isActive = item.status === 'ACTIVE';
    const backgroundColor = isActive ? '#fff' : '#f8d7da';
    const borderColor = isActive ? '#dee2e6' : '#f5c6cb';
  
    // Định dạng start_date và end_date
    const formattedStartDate = moment(item.start_date).format('DD/MM/YYYY');
    const formattedEndDate = moment(item.end_date).format('DD/MM/YYYY');
  
    return (
      <TouchableOpacity 
        style={[styles.classCard, { backgroundColor, borderColor }]}
        onPress={() => navigation.navigate('TeacherClassInfo', { classId: item.class_id })}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.className, { color: isActive ? '#d32f2f' : '#721c24' }]}>{item.class_name}</Text>
          <Text style={[styles.classType, { color: isActive ? '#666' : '#721c24' }]}>Loại: {item.class_type}</Text>
        </View>
  
        <View style={styles.cardContent}>
          {/* Start Date and End Date */}
          <View style={styles.infoRow}>
            <Icon name="calendar-outline" size={20} color={isActive ? '#666' : '#721c24'} />
            <Text style={[styles.infoText, { color: isActive ? '#666' : '#721c24' }]}>
              {formattedStartDate} - {formattedEndDate}
            </Text>
          </View>
  
          {/* Student Count */}
          <View style={styles.infoRow}>
            <Icon name="people-outline" size={20} color={isActive ? '#666' : '#721c24'} />
            <Text style={[styles.infoText, { color: isActive ? '#666' : '#721c24' }]}>
              Số SV: {item.student_count}
            </Text>
          </View>
  
          {/* Status */}
          <View style={styles.infoRow}>
            <Icon name="receipt-outline" size={20} color={isActive ? '#666' : '#721c24'} />
            <Text style={[styles.infoText, { color: isActive ? '#666' : '#721c24' }]}>
              Trạng thái: {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#d32f2f" style={styles.loader} />
      ) : (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.class_id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="school-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>
                Không có lớp học nào
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d32f2f',
  },
  listContainer: {
    padding: 16,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  classType: {
    fontSize: 14,
    marginTop: 4,
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default TeacherClassList;
