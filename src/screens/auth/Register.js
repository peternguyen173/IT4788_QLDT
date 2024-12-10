import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import PushNotification from 'react-native-push-notification';
import Icon from "react-native-vector-icons/Ionicons";

const Register = ({ navigation }) => {
  const [ho, setHo] = useState('');
  const [ten, setTen] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorHo, setErrorHo] = useState('');
  const [errorTen, setErrorTen] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorRole, setErrorRole] = useState('');
  const hoInputRef = useRef(null);
  const [showRoleOption, setShowRoleOption] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    hoInputRef.current?.focus();


  }, []);

  const handleRegister = async () => {
    const uuid = 11111;
    setLoading(true);

    let valid = true;

    // Validation logic
    if (!ho.trim()) {
      setErrorHo('Họ không được để trống!');
      valid = false;
    } else {
      setErrorHo('');
    }

    if (!ten.trim()) {
      setErrorTen('Tên không được để trống!');
      valid = false;
    } else {
      setErrorTen('');
    }

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

    if (!password.trim()) {
      setErrorPassword('Mật khẩu không được để trống!');
      valid = false;
    } else if (password.length < 6 || password.length > 10) {
      setErrorPassword('Mật khẩu phải có độ dài từ 6 đến 10 ký tự!');
      valid = false;
    } else {
      setErrorPassword('');
    }
    if (!confirmPassword.trim()) {
      setErrorConfirmPassword('Confirm Password không được để trống!');
      valid = false;
    } else if (password !== confirmPassword) {
      setErrorConfirmPassword('Mật khẩu xác nhận không khớp!');
      valid = false;
    } else {
      setErrorConfirmPassword('');
    }


    if (!role) {
      setErrorRole('Bạn phải chọn vai trò!');
      valid = false;
    } else {
      setErrorRole('');
    }

    if (!valid) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://157.66.24.126:8080/it4788/signup', {
        ho,
        ten,
        email,
        password,
        uuid,
        role,
      });

      if (response.data.code == 1000) {
        const verifyCode = response.data.verify_code;


        // Navigate to the Verify screen
        navigation.navigate('Verify', {
          email,
          verify_code: verifyCode,
        });
      } else if (response.data.code === 9996) {
        Alert.alert('Email đã được đăng ký', 'Vui lòng sử dụng email khác!');
      } else {
        Alert.alert('Đăng ký thất bại', response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Alert.alert('Email đã được đăng ký', 'Vui lòng sử dụng email khác.');
      } else {
        console.error(error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
      }
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

        <View style={{ position: 'relative', marginBottom: 10 }}>
          <TextInput
              style={[styles.input, { paddingRight: 40 }]} // Thêm padding để tránh chồng biểu tượng
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#fff"
          />
          <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
          >
            <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#fff"
            />
          </TouchableOpacity>
        </View>
        {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}
        <View style={{ position: 'relative', marginBottom: 10 }}>
          <TextInput
              style={[styles.input, { paddingRight: 40 }]} // Thêm padding để tránh chồng biểu tượng
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#fff"
          />
          <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
          >
            <Icon
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#fff"
            />
          </TouchableOpacity>
        </View>
        {errorConfirmPassword ? <Text style={styles.errorText}>{errorConfirmPassword}</Text> : null}

        <View style={styles.pickerContainer}>
          <View style={styles.pickerBorder}>
            <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
                mode="dropdown"
                dropdownIconColor="#fff"
                onFocus={() => setShowRoleOption(false)}
            >
              {showRoleOption && <Picker.Item label="ROLE" value="ROLE" enabled={false} />}
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
  eyeIcon: {
    position: 'absolute',
    right: 18, // Đặt biểu tượng "mắt" sát lề phải
    top: '50%', // Đặt ở giữa chiều dọc
    transform: [{ translateY: -17 }], // Điều chỉnh vị trí để căn giữa
  },
  footer: {
    position: 'relative',
    bottom: -160,
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
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#990000',
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 12,
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
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Register;
