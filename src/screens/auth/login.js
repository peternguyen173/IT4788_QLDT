import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../navigators/AuthProvider';



const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const { login } = useAuth();


  
  const handleLogin = async () => {
    const deviceId = 1; // Assume deviceId is 1
    setLoading(true);

    try {
      const response = await axios.post('http://160.30.168.228:8080/it4788/login', {
        email,
        password,
        deviceId,
      });

      if (response.status === 200) {
        const userData = response.data;

        const user = {
          id: userData.id,
          ho: userData.ho,
          ten: userData.ten,
          username: userData.username,
          token: userData.token,
          active: userData.active,
          role: userData.role,
        };
        // Store the token in AsyncStorage
        await AsyncStorage.setItem('token', userData?.token);
        Alert.alert('Đăng nhập thành công!', `Xin chào, ${userData?.ten}`);
        login(user);
        // Navigate based on the user's role
        if (userData.role === 'STUDENT') {
          navigation.navigate('StudentHome');
        } else if (userData.role === 'TEACHER') {
          navigation.navigate('TeacherHome');
        }
      }
    } catch (error) {
      // Handle login errors
      Alert.alert('Đăng nhập thất bại', 'Vui lòng kiểm tra lại email và mật khẩu.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to IT4788!</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#990000', // Màu nền đỏ đậm
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
      color: '#fff', // Đổi màu chữ tiêu đề thành trắng để dễ đọc
    },
    input: {
      height: 50,
      borderColor: '#fff', // Đổi đường viền thành màu trắng cho nổi bật
      borderWidth: 2,
      marginBottom: 20,
      paddingHorizontal: 10, // Giảm chiều ngang của ô nhập liệu
      borderRadius: 5,
      backgroundColor: '#fff', // Nền input màu trắng
    },
    button: {
      backgroundColor: '#c00000', // Nền nút màu đỏ
      paddingVertical: 10,
      paddingHorizontal: 15, // Giảm chiều ngang của nút
      borderRadius: 25,
      alignItems: 'center',
      alignSelf: 'center', // Căn giữa nút
    },
    buttonText: {
      color: '#fff', // Màu chữ nút
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  

export default Login;
