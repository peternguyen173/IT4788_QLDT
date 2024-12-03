import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import {useNavigation} from "@react-navigation/native";

const RegisterClass = () => {
    const [classId, setClassId] = useState('');
    const [registeredClasses, setRegisteredClasses] = useState([]);
    const { userData } = useAuth();
    const navigation = useNavigation();

    const [myClasses, setMyClasses] = useState([]); // Danh sách lớp của tôi

    const fetchMyClasses = async (page = 0, pageSize = 20) => {
        try {
            const response = await axios.post(
                'http://157.66.24.126:8080/it5023e/get_class_list',
                {
                    token: userData.token,
                    role: 'STUDENT',
                    account_id: userData.account_id,
                    pageable_request: {
                        page: page.toString(),
                        page_size: pageSize.toString(),
                    },
                }
            );

            if (response.data.meta.code === '1000') {
                const fetchedClasses = response.data.data.page_content || [];
                const pageInfo = response.data.data.page_info;

                setMyClasses((prev) =>
                    page === 0 ? fetchedClasses : [...prev, ...fetchedClasses]
                ); // Nếu là trang đầu, thay thế danh sách; nếu không, thêm dữ liệu mới

                return pageInfo; // Trả về thông tin phân trang để sử dụng tiếp
            } else {
                Alert.alert('Lỗi', response.data.meta.message || 'Không thể tải danh sách lớp của bạn.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể lấy danh sách lớp học. Vui lòng thử lại.');
        }
    };


    useEffect(() => {
        fetchMyClasses();
    }, []);

    // Lấy thông tin lớp học và thêm vào danh sách đăng ký
    const addClassToRegisterList = async () => {
        if (!classId.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mã lớp.');
            return;
        }

        try {
            const response = await axios.post(
                'http://157.66.24.126:8080/it5023e/get_basic_class_info',
                {
                    token: userData.token,
                    role: 'STUDENT',
                    account_id: userData.account_id,
                    class_id: classId,
                }
            );

            const classData = response.data.data;

            if (!classData) {
                Alert.alert('Lỗi', 'Không tìm thấy thông tin lớp học.');
                return;
            }

            // Kiểm tra nếu lớp đã có trong danh sách lớp của tôi
            if (Array.isArray(myClasses) && myClasses.some((item) => item.class_id === classId)) {
                Alert.alert('Thông báo', 'Lớp này đã có trong danh sách lớp của bạn.');
                return;
            }

            // Kiểm tra nếu lớp đã được thêm vào danh sách đăng ký
            if (registeredClasses.some((item) => item.class_id === classId)) {
                Alert.alert('Thông báo', 'Lớp này đã được thêm vào danh sách đăng ký.');
                return;
            }

            // Thêm lớp vào danh sách đăng ký
            setRegisteredClasses((prev) => [
                ...prev,
                {
                    class_id: classData.class_id,
                    class_name: classData.class_name,
                    lecturer_id: classData.lecturer_id,
                    max_student_amount: classData.max_student_amount,
                    attached_code: classData.attached_code || 'Không có',
                    class_type: classData.class_type,
                    start_date: classData.start_date,
                    end_date: classData.end_date,
                    status: classData.status,
                },
            ]);
            setClassId('');
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tìm thông tin lớp học. Vui lòng thử lại.');
        }
    };


    // Xóa lớp khỏi danh sách đăng ký
    const removeClassFromRegisterList = (id) => {
        setRegisteredClasses((prev) => prev.filter((item) => item.class_id !== id));
    };

    // Gửi danh sách lớp đăng ký lên backend
    const submitRegisteredClasses = async () => {
        if (registeredClasses.length === 0) {
            Alert.alert('Thông báo', 'Danh sách đăng ký trống.');
            return;
        }

        try {
            const response = await axios.post(
                'http://157.66.24.126:8080/it5023e/register_class',
                {
                    token: userData.token,
                    class_ids: registeredClasses.map((item) => item.class_id),
                }
            );

            if (response.data.meta.code === '1000') {
                Alert.alert('Thành công', 'Đăng ký lớp học thành công.');
                setRegisteredClasses([]); // Xóa danh sách sau khi gửi thành công
            } else {
                Alert.alert('Lỗi', response.data.meta.message || 'Đăng ký thất bại.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể gửi đăng ký. Vui lòng thử lại.');
        }
    };

    const renderRegisteredClass = ({ item }) => (
        <View style={styles.registeredClassItem}>
            <View>
                <Text style={styles.registeredClassText}>Mã lớp: {item.class_id}</Text>
                <Text style={styles.registeredClassText}>Tên lớp: {item.class_name}</Text>
                <Text style={styles.registeredClassText}>Loại lớp: {item.class_type}</Text>
                <Text style={styles.registeredClassText}>
                    Thời gian: {item.start_date} - {item.end_date}
                </Text>
                <Text style={styles.registeredClassText}>Số lượng tối đa: {item.max_student_amount}</Text>
                <Text style={styles.registeredClassText}>
                    Mã lớp kèm: {item.attached_code}
                </Text>
            </View>
            <TouchableOpacity onPress={() => removeClassFromRegisterList(item.class_id)}>
                <Text style={styles.removeButton}>Xóa</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Đăng ký lớp học</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Mã lớp"
                    value={classId}
                    onChangeText={setClassId}
                />
                <TouchableOpacity style={styles.addButton} onPress={addClassToRegisterList}>
                    <Text style={styles.addButtonText}>Đăng ký</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.registeredListContainer}>
                <Text style={styles.sectionHeader}>Danh sách lớp đã đăng ký</Text>
                {registeredClasses.length > 0 ? (
                    <FlatList
                        data={registeredClasses}
                        renderItem={renderRegisteredClass}
                        keyExtractor={(item) => item.class_id}
                    />
                ) : (
                    <Text style={styles.emptyText}>Chưa có lớp nào được đăng ký.</Text>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={submitRegisteredClasses}>
                    <Text style={styles.submitButtonText}>Gửi đăng ký</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.submitButton, styles.infoButton]}
                    onPress={() => navigation.navigate('OpenClassList')}
                >
                    <Text style={styles.submitButtonText}>Thông tin danh sách lớp mở</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d32f2f',
        textAlign: 'center',
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginRight: 8,
    },
    addButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    registeredListContainer: {
        flex: 1,
        marginBottom: 16,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 8,
    },
    registeredClassItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    registeredClassText: {
        fontSize: 14,
    },
    removeButton: {
        color: '#d32f2f',
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 16,
    },
    submitButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    infoButton: {
        backgroundColor: '#555',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#555',
        fontStyle: 'italic',
        marginTop: 8,
    },
});

export default RegisterClass;
