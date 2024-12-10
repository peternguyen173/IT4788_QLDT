import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';

const VerifyScreen = ({ route, navigation }) => {
    const { email, verify_code } = route.params; // Retrieve email and verification code from params
    const [code, setCode] = useState(verify_code); // Pre-fill code with the passed verify_code
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleVerifyCode = () => {
        if (code === verify_code) {
            setShowSuccessModal(true);
        } else {
            Alert.alert('Mã xác thực không đúng', 'Vui lòng kiểm tra lại mã xác thực.');
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
                                navigation.navigate('Login'); // Navigate to the Home screen or another screen if needed
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
