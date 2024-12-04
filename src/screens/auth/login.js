import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../navigators/AuthProvider';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const { login,fcmToken } = useAuth();

  const handleLogin = async () => {
    const device_id = 1; // Assume deviceId is 1
    setLoading(true);
    console.log("dsad",fcmToken);
    try {
      const response = await axios.post('http://157.66.24.126:8080/it4788/login', {
        email,
        password,
        device_id,
        fcm_token: fcmToken
      });

      if (response.status === 200) {
        const userData = response.data.data;
        const user = {
          id: userData.id,
          ho: userData.ho,
          ten: userData.ten,
          username: userData.username,
          email:userData.email,
          token: userData.token,
          active: userData.active,
          role: userData.role,
          avatar: userData.avatar
        };
        login(user);
        if (userData?.token) {
          await AsyncStorage.setItem('token', userData.token);
        } else {
          console.warn('Token is undefined or null, not storing it.');
        }
        if (userData.role === 'STUDENT') {
          navigation.navigate('StudentHome');
        } else if (userData.role === 'TEACHER') {
          navigation.navigate('TeacherHome');
        }
      }
    } catch (error) {
      Alert.alert('Đăng nhập thất bại', 'Vui lòng kiểm tra lại email và mật khẩu.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Close modal and send a password recovery request
    setForgotPasswordVisible(false);
    Alert.alert('Yêu cầu được gửi', `Vui lòng kiểm tra email của bạn: ${forgotEmail}`);
  };

  return (
    <View style={styles.container}>
     <Text style={styles.hustTitle}>HUST</Text>
      <Text style={styles.title}>Welcome to QLDT!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Link Quên mật khẩu */}
      <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Forgot Password Modal */}
      <Modal
        visible={forgotPasswordVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setForgotPasswordVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bạn hãy nhập Email (của trường) hoặc MSSV (đối với Sinh viên) để lấy lại mật khẩu. Mật khẩu mới sẽ được gửi về email của bạn.</Text>
            <View style={styles.inputWithIcon}>
              <MaterialCommunityIcons name="account" size={20} color="#333" style={styles.icon} />
              <TextInput
                style={styles.modalInput}
                placeholder="Email hoặc mã số sinh viên"
                value={forgotEmail}
                onChangeText={setForgotEmail}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setForgotPasswordVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleForgotPassword}>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Chưa có tài khoản? Đăng ký */}
      <View style={styles.footer}>
        <Text style={styles.registerText}>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
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
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
    hustTitle: {
      fontSize: 70, // Tăng hoặc giảm kích thước tùy theo yêu cầu
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#fff',
       // Khoảng cách giữa "HUST" và "Welcome to QLDT!"
         marginTop: -50, // Giá trị âm để đẩy lên cao hơn. Bạn có thể điều chỉnh theo ý muốn.
          marginBottom: 50
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
  forgotPassword: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
  },
  registerLink: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10, // More rounded corners
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  modalInput: {
    flex: 1,
    height: 45,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#ff0000', // Red text for "Hủy"
    fontSize: 16,
  },
  confirmButtonText: {
    color: '#6a1b9a', // Darker purple for "Xác nhận"
    fontSize: 16,
  },
});

export default Login;
