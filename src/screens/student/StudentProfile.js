import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { useAuth } from '../../navigators/AuthProvider';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const { userData, updateUserData, logout } = useAuth();
  const [name, setName] = useState(userData?.ten || '');
  const [avatar, setAvatar] = useState(userData?.avatar || null);
  const [isEditing, setIsEditing] = useState(false);

  const transformGoogleDriveLink = (link) => {
    if (link?.includes('drive.google.com')) {
      const fileId = link.split('/d/')[1]?.split('/')[0];
      return `https://drive.google.com/uc?id=${fileId}`;
    }
    return link; // Return original link if not a Google Drive URL
  };


  // Image picker function
 const requestPermissions = async () => {
   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
   if (status !== 'granted') {
     alert('Sorry, we need camera roll permissions to make this work!');
     return false;
   }
   return true;
 };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;

      try {
        const formData = new FormData();
        formData.append('token', userData?.token);
        formData.append('file', {
          uri: selectedImageUri,
          type: result.assets[0].mimeType || 'image/jpeg',
          name: result.assets[0].fileName || 'uploaded_image.jpg',
        });

        const response = await fetch('http://157.66.24.126:8080/it4788/change_info_after_signup', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const uploadResult = await response.json();
        if (uploadResult.code === "1000") {
          // Cập nhật avatar ngay lập tức
          setAvatar(uploadResult.data.avatar);

          // updateUserData({
          //  ...userData,
          //   avatar: uploadResult.data.avatar,
          //  });

          alert('Avatar updated successfully!');
        } else {
          alert('Error updating avatar: ' + uploadResult.message);
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('An error occurred during the upload. Please try again.');
      }
    } else {
      alert('No image selected or an error occurred.');
    }
  };




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Image source={{ uri: transformGoogleDriveLink(avatar) }} style={styles.avatar} />

      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.changeAvatarText}>Change Avatar</Text>
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      ) : (
        <>
          <Text style={styles.infoLabel}>Tên:</Text>
          <Text style={styles.infoValue}>{name}</Text>
        </>
      )}



      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changeAvatarText: {
    fontSize: 14,
    color: '#007bff',
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
