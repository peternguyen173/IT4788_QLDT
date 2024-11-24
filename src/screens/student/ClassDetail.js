import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ClassDetail = ({ route, navigation }) => {
    const { classData } = route.params; // Dữ liệu lớp được truyền từ màn hình trước

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Thông tin chi tiết lớp</Text>
            <Text style={styles.detailText}>Mã lớp: {classData.class_id}</Text>
            <Text style={styles.detailText}>Tên lớp: {classData.class_name}</Text>
            <Text style={styles.detailText}>Loại lớp: {classData.class_type}</Text>
            <Text style={styles.detailText}>Giảng viên: {classData.lecturer_name}</Text>
            <Text style={styles.detailText}>
                Thời gian: {classData.start_date} đến {classData.end_date}
            </Text>
            <Text style={styles.detailText}>Số sinh viên: {classData.student_count}</Text>
            <Text style={styles.detailText}>Trạng thái: {classData.status}</Text>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
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
    detailText: {
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
    },
    backButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ClassDetail;
