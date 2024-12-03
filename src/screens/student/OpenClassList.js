import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TextInput,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';

const OpenClassList = ({ navigation }) => {
    const [openClasses, setOpenClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        class_id: '',
        class_name: '',
        class_type: '',
    });
    const { userData } = useAuth();

    useEffect(() => {
        fetchOpenClasses();
    }, []);

    const fetchOpenClasses = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                'http://157.66.24.126:8080/it5023e/get_classes_by_filter',
                {
                    token: userData.token,
                    class_id: filters.class_id || null,
                    class_name: filters.class_name || null,
                    class_type: filters.class_type || null,
                    pageable_request: {
                        page: '0',
                        page_size: '10',
                    },
                }
            );
            setOpenClasses(response.data.data.page_content || []);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể lấy danh sách lớp mở. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const toggleClassTypeFilter = (type) => {
        setFilters((prev) => ({
            ...prev,
            class_type: prev.class_type === type ? '' : type, // Nếu bấm lại sẽ bỏ chọn
        }));
    };

    const renderClassItem = ({ item }) => (
        <TouchableOpacity
            style={styles.classItem}
            onPress={() => navigation.navigate('ClassDetail', { classData: item })}
        >
            <Text style={styles.classText}>
                {item.class_id} - {item.class_name}
            </Text>
            <Text style={styles.classText}>Loại lớp: {item.class_type}</Text>
            <Text style={styles.classText}>
                Thời gian: {item.start_date} đến {item.end_date}
            </Text>
            <Text style={styles.classText}>Số sinh viên: {item.student_count}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Danh sách lớp mở</Text>
            <View style={styles.filterContainer}>
                {/* Lọc theo Mã lớp */}
                <TextInput
                    style={styles.input}
                    placeholder="Mã lớp"
                    value={filters.class_id}
                    onChangeText={(text) => setFilters((prev) => ({ ...prev, class_id: text }))}
                />

                {/* Lọc theo Tên lớp */}
                <TextInput
                    style={styles.input}
                    placeholder="Tên lớp"
                    value={filters.class_name}
                    onChangeText={(text) => setFilters((prev) => ({ ...prev, class_name: text }))}
                />

                {/* Lọc theo Loại lớp */}
                <View style={styles.typeFilterContainer}>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            filters.class_type === 'LT' && styles.selectedTypeButton,
                        ]}
                        onPress={() => toggleClassTypeFilter('LT')}
                    >
                        <Text
                            style={[
                                styles.typeButtonText,
                                filters.class_type === 'LT' && styles.selectedTypeButtonText,
                            ]}
                        >
                            LT
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            filters.class_type === 'BT' && styles.selectedTypeButton,
                        ]}
                        onPress={() => toggleClassTypeFilter('BT')}
                    >
                        <Text
                            style={[
                                styles.typeButtonText,
                                filters.class_type === 'BT' && styles.selectedTypeButtonText,
                            ]}
                        >
                            BT
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            filters.class_type === 'LT_BT' && styles.selectedTypeButton,
                        ]}
                        onPress={() => toggleClassTypeFilter('LT_BT')}
                    >
                        <Text
                            style={[
                                styles.typeButtonText,
                                filters.class_type === 'LT_BT' && styles.selectedTypeButtonText,
                            ]}
                        >
                            LT_BT
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Nút Lọc */}
                <TouchableOpacity style={styles.filterButton} onPress={fetchOpenClasses}>
                    <Text style={styles.filterButtonText}>Lọc</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#d32f2f" />
            ) : (
                <FlatList
                    data={openClasses}
                    renderItem={renderClassItem}
                    keyExtractor={(item) => item.class_id}
                />
            )}
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
    filterContainer: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    typeFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    typeButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    selectedTypeButton: {
        backgroundColor: '#d32f2f',
        borderColor: '#d32f2f',
    },
    typeButtonText: {
        fontSize: 14,
        color: '#333',
    },
    selectedTypeButtonText: {
        color: '#fff',
    },
    filterButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    classItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    classText: {
        fontSize: 14,
    },
});

export default OpenClassList;
