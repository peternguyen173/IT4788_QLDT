import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Platform
} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const StudentClassList = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const { userData, logout } = useAuth();


  // State cho các filter
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [lecturerFilter, setLecturerFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [classes, statusFilter, lecturerFilter, startDateFilter, endDateFilter]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://157.66.24.126:8080/it5023e/get_class_list',
        {
          token: userData.token,
          role: 'STUDENT',
          account_id: userData.id, // ID tài khoản từ AuthProvider
          pageable_request: {
            page: 0, // Trang đầu tiên
            page_size: 10, // Số lượng lớp mỗi trang
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
          },
        }
      );
      setClasses(response.data.data.page_content);
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
        onPress={() => navigation.navigate('StudentClassInfo', { classId: item.class_id })}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.className, { color: isActive ? '#d32f2f' : '#721c24' }]}>{item.class_id} - {item.class_name}</Text>
          {/*<Text style={[styles.classType, { color: isActive ? '#666' : '#721c24' }]}>Loại: {item.class_type}</Text>*/}
        </View>

        <View style={styles.cardContent}>
          {/* Start Date and End Date */}
          <View style={styles.infoRow}>
            <Icon name="calendar-outline" size={20} color={isActive ? '#666' : '#721c24'} />
            <Text style={[styles.infoText, { color: isActive ? '#666' : '#721c24' }]}>
              {formattedStartDate} - {formattedEndDate}
            </Text>
          </View>

          {/* Status */}
          <View style={styles.infoRow}>
            <Icon name="receipt-outline" size={20} color={isActive ? '#666' : '#721c24'} />
            <Text style={[styles.infoText, { color: isActive ? '#666' : '#721c24' }]}>
              Giảng viên: {item.lecturer_name}
            </Text>
          </View>

          {/* Student Count */}
          <View style={styles.infoRow}>
            <Icon name="people-outline" size={20} color={isActive ? '#666' : '#721c24'} />
            <Text style={[styles.infoText, { color: isActive ? '#666' : '#721c24' }]}>
              Số SV: {item.student_count}
            </Text>
          </View>


        </View>
      </TouchableOpacity>
    );
  };

  const applyFilters = () => {
    let result = [...classes];
    if (startDateFilter && endDateFilter && moment(startDateFilter).isAfter(endDateFilter)) {
      Alert.alert("Lỗi", "Ngày bắt đầu không thể sau ngày kết thúc!");
      setEndDateFilter = null;
      return;
    }

    // Filter theo status
    if (statusFilter !== 'ALL') {
      result = result.filter(cls => cls.status === statusFilter);
    }

    // Filter theo tên gv
    if (lecturerFilter) {
      result = result.filter(cls =>
        cls.lecturer_name.toLowerCase().includes(lecturerFilter.toLowerCase())
      );
    }

    // Filter theo ngày bắt đầu (các lớp từ startDate trở về sau)
    if (startDateFilter) {
      result = result.filter(cls =>
        moment(cls.start_date).isSameOrAfter(startDateFilter, 'day')
      );
    }

    // Filter theo ngày kết thúc (các lớp từ endDate trở về trước)
    if (endDateFilter) {
      result = result.filter(cls =>
        moment(cls.end_date).isSameOrBefore(endDateFilter, 'day')
      );
    }

    setFilteredClasses(result);
  };

  const resetFilters = () => {
    setStatusFilter('ALL');
    setLecturerFilter('');
    setStartDateFilter(null);
    setEndDateFilter(null);
  };

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Lọc lớp học</Text>

          {/* Status Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Trạng thái</Text>
            <View style={styles.radioContainer}>
              {['ALL', 'ACTIVE', 'INACTIVE'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.radioButton,
                    statusFilter === status && styles.radioButtonSelected
                  ]}
                  onPress={() => setStatusFilter(status)}
                >
                  <Text style={styles.radioText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Lecturer Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Giảng viên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên giảng viên"
              value={lecturerFilter}
              onChangeText={setLecturerFilter}
            />
          </View>

          {/* Start Date Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Ngày bắt đầu</Text>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text>
                {startDateFilter
                  ? moment(startDateFilter).format('DD/MM/YYYY')
                  : 'Chọn ngày'}
              </Text>
            </TouchableOpacity>

            {showStartDatePicker && (
              <DateTimePicker
                testID="startDatePicker"
                value={startDateFilter || new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || startDateFilter;
                  setShowStartDatePicker(Platform.OS === 'ios');
                  setStartDateFilter(currentDate);
                }}
              />
            )}
          </View>

          {/* End Date Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Ngày kết thúc</Text>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text>
                {endDateFilter
                  ? moment(endDateFilter).format('DD/MM/YYYY')
                  : 'Chọn ngày'}
              </Text>
            </TouchableOpacity>

            {showEndDatePicker && (
              <DateTimePicker
                testID="endDatePicker"
                value={endDateFilter || new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || endDateFilter;
                  setShowEndDatePicker(Platform.OS === 'ios');
                  setEndDateFilter(currentDate);
                }}
              />
            )}
          </View>

          {/* Modal Buttons */}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.resetButton]}
              onPress={resetFilters}
            >
              <Text style={styles.modalButtonText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Icon name="filter" size={24} color="#fff" />
        <Text style={styles.filterButtonText}>Lọc lớp</Text>
      </TouchableOpacity>

      {renderFilterModal()}

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredClasses} // Hiển thị danh sách lọc
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterSection: {
    width: '100%',
    marginBottom: 15,
  },
  filterLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#d32f2f',
  },
  radioText: {
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#ccc',
  },
  applyButton: {
    backgroundColor: '#d32f2f',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StudentClassList;