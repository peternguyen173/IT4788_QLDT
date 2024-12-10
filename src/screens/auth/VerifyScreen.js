import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import axios from 'axios';

const VerifyScreen = ({ route, navigation }) => {
    const { email, verify_code } = route.params; // Nhận email và mã xác thực từ route params
    const [code, setCode] = useState(verify_code); // Điền trước mã xác thực được truyền
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('http://157.66.24.126:8080/it4788/check_verify_code', {
                email: email,
                verify_code: code,
            });

            if (response.data.code === '1000') {
                setShowSuccessModal(true); // Hiển thị modal thành công
            } else {
                Alert.alert('Xác thực thất bại', 'Mã xác thực không đúng hoặc đã hết hạn.');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            Alert.alert('Lỗi', 'Không thể kết nối với máy chủ. Vui lòng thử lại.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nhập mã xác thực</Text>
            <TextInput
                style={styles.input}
                placeholder="Mã xác thực"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
                placeholderTextColor="#fff"
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
                <Text style={styles.buttonText}>Xác thực</Text>
            </TouchableOpacity>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.successText}>Xác thực thành công!</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setShowSuccessModal(false);
                                navigation.navigate('Login'); // Điều hướng đến trang Login
                            }}
                        >
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#990000',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#fff',
    },
    input: {
        height: 50,
        fontSize: 16,
        borderColor: '#fff',
        borderWidth: 2,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#000',
    },
    button: {
        backgroundColor: '#c00000',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        alignItems: 'center',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    successText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#c00000',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default VerifyScreen;
