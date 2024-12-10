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

const AddStudent = ({ route }) => {
    const { classId } = route.params; // Nhận classId từ params
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Quản lý trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const { userData } = useAuth();

    const [currentStudents, setCurrentStudents] = useState([]);

    useEffect(() => {
        const fetchClassInfo = async () => {
            try {
                const response = await axios.post('http://157.66.24.126:8080/it5023e/get_class_info', {
                    token: userData.token,
                    role: 'LECTURER', // Có thể thay đổi tùy vai trò của bạn
                    account_id: "2", // Giá trị bừa nếu không cần
                    class_id: classId,
                });

                if (response.data.meta.code === '1000') {
                    setCurrentStudents(response.data.data.student_accounts || []);
                } else {
                    Alert.alert('Lỗi', response.data.meta.message || 'Không thể tải danh sách sinh viên.');
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Lỗi', 'Không thể tải danh sách sinh viên. Vui lòng thử lại.');
            }
        };

        fetchClassInfo();
    }, [classId, userData.token]);

    // Hàm tìm kiếm tài khoản với phân trang
    const searchAccount = async (page = 0) => {
        if (!searchQuery.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập từ khóa tìm kiếm.');
            return;
        }

        try {
            const response = await axios.post(
                'http://157.66.24.126:8080/it5023e/search_account',
                {
                    search: searchQuery,
                    pageable_request: {
                        page: page.toString(),
                        page_size: "15",
                    },
                }
            );

            if (response.data.meta.code === '1000') {
                setSearchResults(response.data.data.page_content || []);
                setCurrentPage(page);
                setTotalPages(response.data.data.page_info.total_page);
            } else {
                Alert.alert('Lỗi', response.data.meta.message || 'Không thể tìm kiếm tài khoản.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tìm kiếm tài khoản. Vui lòng thử lại.');
        }
    };

    // Hiển thị hộp thoại xác nhận trước khi thêm tài khoản
    const confirmAddAccount = (account) => {
        const alreadyInClass = currentStudents.some(
            (student) => student.account_id === account.account_id
        );

        if (alreadyInClass) {
            Alert.alert(
                'Cảnh báo',
                `Sinh viên ${account.last_name} ${account.first_name} (ID: ${account.account_id}) đã có trong lớp.`
            );
            return;
        }

        Alert.alert(
            'Xác nhận',
            `Bạn có chắc chắn muốn thêm tài khoản ${account.last_name} ${account.first_name} (ID: ${account.account_id}) vào lớp?`,
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Đồng ý',
                    onPress: () => addAccount(account),
                },
            ]
        );
    };


    // Thêm tài khoản vào lớp
    const addAccount = async (account) => {
        try {
            const response = await axios.post('http://157.66.24.126:8080/it5023e/add_student', {
                token: userData.token,
                class_id: classId,
                account_id: account.account_id,
            });

            if (response.data.meta.code === '1000') {
                Alert.alert('Thành công', `Đã thêm tài khoản ${account.last_name} ${account.first_name} vào lớp.`);
            } else {
                Alert.alert('Lỗi', response.data.meta.message || 'Không thể thêm tài khoản vào lớp.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể thêm tài khoản vào lớp. Vui lòng thử lại.');
        }
    };

    // Render kết quả tìm kiếm
    const renderSearchResult = ({ item }) => (
        <View style={styles.resultItem}>
            <View>
                <Text style={styles.resultText}>ID: {item.account_id}</Text>
                <Text style={styles.resultText}>
                    Tên: {item.last_name} {item.first_name}
                </Text>
                <Text style={styles.resultText}>Email: {item.email}</Text>
            </View>
            <TouchableOpacity onPress={() => confirmAddAccount(item)}>
                <Text style={styles.addButton}>Thêm</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Thêm sinh viên vào lớp {classId}</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Tìm kiếm tài khoản"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.searchButton} onPress={() => searchAccount(0)}>
                    <Text style={styles.searchButtonText}>Tìm</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.resultsContainer}>
                <Text style={styles.sectionHeader}>Kết quả tìm kiếm</Text>
                <View style={styles.searchResultsBox}>
                    <FlatList
                        data={searchResults}
                        renderItem={renderSearchResult}
                        keyExtractor={(item) => item.account_id}
                    />
                </View>

                <View style={styles.pagination}>
                    <TouchableOpacity
                        disabled={currentPage === 0}
                        onPress={() => searchAccount(currentPage - 1)}
                        style={[
                            styles.pageButton,
                            currentPage === 0 && styles.disabledButton,
                        ]}
                    >
                        <Text style={styles.pageButtonText}>Trang trước</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageInfoText}>
                        Trang {currentPage + 1} / {totalPages}
                    </Text>
                    <TouchableOpacity
                        disabled={currentPage === totalPages - 1}
                        onPress={() => searchAccount(currentPage + 1)}
                        style={[
                            styles.pageButton,
                            currentPage === totalPages - 1 && styles.disabledButton,
                        ]}
                    >
                        <Text style={styles.pageButtonText}>Trang sau</Text>
                    </TouchableOpacity>
                </View>
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
        color: '#1976d2',
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    searchButton: {
        backgroundColor: '#1976d2',
        paddingVertical: 8,
        height: 45,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 8,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    resultsContainer: {
        flex: 1,
        marginBottom: 16,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 8,
    },
    searchResultsBox: {
        height: '77%', // Tăng chiều cao lên 70% màn hình hoặc tùy chỉnh theo ý bạn
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 8,
        padding: 8,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 8,
    },
    pageInfoText: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
        marginHorizontal: 8,
    },
    pageButton: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1976d2',
        alignItems: 'center',
    },
    disabledButton: {
        borderColor: '#ccc',
        backgroundColor: '#f5f5f5',
    },
    pageButtonText: {
        color: '#1976d2',
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    resultText: {
        fontSize: 14,
    },
    addButton: {
        color: '#1976d2',
        fontWeight: 'bold',
    },
});

export default AddStudent;
