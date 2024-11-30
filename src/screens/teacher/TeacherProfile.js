import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useAuth } from '../../navigators/AuthProvider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import icon library
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const { userData, setUserData, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  // Chuyển đổi link Google Drive nếu cần
  const transformGoogleDriveLink = (link) => {
    if (link?.includes('drive.google.com')) {
      const fileId = link.split('/d/')[1]?.split('/')[0];
      return `https://drive.google.com/uc?id=${fileId}`;
    }
    return link;
  };
  const [avatar, setAvatar] = useState(
      transformGoogleDriveLink(userData?.avatar) ||
      'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
  );

  // State để điều khiển hiển thị mật khẩu
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Cần cấp quyền truy cập thư viện ảnh để đổi avatar.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const selectedImageUri = result.assets[0].uri;

      try {
        const formData = new FormData();
        formData.append('token', userData?.token);
        formData.append('file', {
          uri: selectedImageUri,
          type: result.assets[0].mimeType || 'image/jpeg',
          name: 'avatar.jpg',
        });

        const response = await fetch('http://157.66.24.126:8080/it4788/change_info_after_signup', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const uploadResult = await response.json();
        if (uploadResult.code === '1000') {
          setAvatar(transformGoogleDriveLink(uploadResult.data.avatar));
          setUserData((prevData) => ({
            ...prevData,
            avatar: uploadResult.data.avatar,
          }));
          Alert.alert('Success', 'Avatar updated successfully!');
        } else {
          Alert.alert('Error', uploadResult.message || 'Lỗi khi đổi avatar.');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        Alert.alert('Error', 'Có lỗi xảy ra khi tải avatar lên. Vui lòng thử lại.');
      }
    } else {
      Alert.alert('Cancelled', 'Không có ảnh nào được chọn.');
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Mật khẩu mới và mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const response = await fetch('http://157.66.24.126:8080/it4788/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: userData?.token,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const result = await response.json();
      if (result.code === '1000') {
        Alert.alert('Success', 'Password changed successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowPasswordFields(false);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'An error occurred while changing the password. Please try again.');
    }
  };

  return (
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>Thông tin cá nhân</Text>

            <Image source={{ uri: avatar }} style={styles.avatar} />

            <TouchableOpacity style={styles.changeAvatarButton} onPress={pickImage}>
              <Text style={styles.changeAvatarText}>Đổi Avatar</Text>
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Tên:</Text>
              <Text style={styles.infoValue}>{userData?.ho} {userData?.ten}</Text>

              <Text style={styles.infoLabel}>Mã giảng viên:</Text>
              <Text style={styles.infoValue}>{userData?.id}</Text>

              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{userData?.email}</Text>
            </View>

            {showPasswordFields ? (
                <>
                  <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        placeholder="Nhập mật khẩu cũ"
                        secureTextEntry={!showOldPassword}
                    />
                    <MaterialIcons
                        name={showOldPassword ? 'visibility' : 'visibility-off'}
                        size={24}
                        color="gray"
                        onPress={() => setShowOldPassword(!showOldPassword)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Nhập mật khẩu mới"
                        secureTextEntry={!showNewPassword}
                    />
                    <MaterialIcons
                        name={showNewPassword ? 'visibility' : 'visibility-off'}
                        size={24}
                        color="gray"
                        onPress={() => setShowNewPassword(!showNewPassword)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                        placeholder="Xác nhận mật khẩu mới"
                        secureTextEntry={!showConfirmPassword}
                    />
                    <MaterialIcons
                        name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                        size={24}
                        color="gray"
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </View>

                  <TouchableOpacity style={styles.changePasswordButton} onPress={changePassword}>
                    <Text style={styles.changePasswordButtonText}>Xác nhận</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={styles.cancelPasswordButton}
                      onPress={() => setShowPasswordFields(false)}
                  >
                    <Text style={styles.cancelPasswordButtonText}>Đóng</Text>
                  </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity
                    style={styles.showPasswordButton}
                    onPress={() => setShowPasswordFields(true)}
                >
                  <Text style={styles.showPasswordButtonText}>Đổi mật khẩu</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 130, // Tăng chiều rộng avatar
    height: 130, // Tăng chiều cao avatar
    borderRadius: 75, // Đảm bảo hình tròn
    marginBottom: 20,
  },
  infoContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '90%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  showPasswordButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  showPasswordButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  changePasswordButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelPasswordButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  cancelPasswordButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 50,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  changeAvatarButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  changeAvatarText: {
    color: '#fff',
    fontSize: 16,
  },
});


export default Profile;
