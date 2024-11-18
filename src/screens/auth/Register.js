import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const Register = ({ navigation }) => {
  const [ho, setHo] = useState('');  // Luôn là chuỗi
  const [ten, setTen] = useState(''); // Luôn là chuỗi
  const [email, setEmail] = useState(''); // Luôn là chuỗi
  const [password, setPassword] = useState(''); // Luôn là chuỗi
  const [role, setRole] = useState('');  // Luôn là chuỗi
  const [loading, setLoading] = useState(false);
  const [errorHo, setErrorHo] = useState('');
  const [errorTen, setErrorTen] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorRole, setErrorRole] = useState(''); // Added state for role error

  const hoInputRef = useRef(null);

  useEffect(() => {
    hoInputRef.current?.focus(); // Tự động focus vào ô nhập "Họ" khi component được mount
  }, []);

  const handleRegister = async () => {
    const uuid = 11111; // UUID mặc định
    setLoading(true);
  
    let valid = true;
  
    // Kiểm tra họ
    if (!ho.trim()) {
      setErrorHo('Họ không được để trống!');
      valid = false;
    } else {
      setErrorHo('');
    }
  
    // Kiểm tra tên
    if (!ten.trim()) {
      setErrorTen('Tên không được để trống!');
      valid = false;
    } else {
      setErrorTen('');
    }
  
    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorEmail('Email không được để trống!');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setErrorEmail('Email không hợp lệ!');
      valid = false;
    } else {
      setErrorEmail('');
    }
  
    // Kiểm tra mật khẩu
    if (!password.trim()) {
      setErrorPassword('Password không được để trống!');
      valid = false;
    } else {
      setErrorPassword('');
    }
  
    if (!role) {
      setErrorRole('Bạn phải chọn vai trò!'); // Set role error message
      valid = false;
    } else {
      setErrorRole(''); // Clear role error message if valid
    }
  
    if (!valid) {
      setLoading(false);
      return;
    }
  
    // Thực hiện đăng ký nếu tất cả dữ liệu hợp lệ
    try {
      const response = await axios.post('http://160.30.168.228:8080/it4788/signup', {
        ho,
        ten,
        email,
        password,
        uuid,
        role,
      });
  
      if (response.data.status_code === 1000) {
        Alert.alert('Đăng ký thành công!', 'Vui lòng kiểm tra email để nhận mã xác thực.');
        navigation.navigate('Verify', {
          email,
          verify_code: response.data.verify_code,
        });
      } else {
        Alert.alert('Đăng ký thất bại', response.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>
      <View style={styles.nameContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={hoInputRef}
            style={styles.input}
            placeholder="Họ"
            value={ho}
            onChangeText={setHo}
            autoCorrect={false}
            placeholderTextColor="#fff"
          />
          {errorHo ? <Text style={styles.errorText}>{errorHo}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tên"
            value={ten}
            onChangeText={setTen}
            placeholderTextColor="#fff"
          />
          {errorTen ? <Text style={styles.errorText}>{errorTen}</Text> : null}
        </View>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#fff"
      />
      {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#fff"
      />
      {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}

      <View style={styles.pickerContainer}>
        <View style={styles.pickerBorder}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
            mode="dropdown"
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="STUDENT" value="STUDENT" />
            <Picker.Item label="LECTURER" value="LECTURER" />
          </Picker>
        </View>
        {errorRole ? <Text style={styles.errorText}>{errorRole}</Text> : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
      </TouchableOpacity>
    
      <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginContainer}>
        <Text style={styles.loginText}>Hoặc đăng nhập với username/password</Text>
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
  footer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '48%',
  },
  input: {
    height: 50,
    fontSize: 16,
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 10, // Đặt lại khoảng cách giữa các ô input
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#990000',
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 12, // Khoảng cách dưới của thông báo lỗi với phần tử tiếp theo
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerBorder: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    backgroundColor: '#990000',
    color: '#fff',
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
  loginContainer: {
    marginTop: 20, // Khoảng cách từ nút đăng ký xuống dòng chữ
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline', // Gạch chân dòng chữ
  },

});


export default Register;
