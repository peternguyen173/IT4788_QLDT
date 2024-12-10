import { ca } from 'date-fns/locale';
import React from 'react';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../navigators/AuthProvider';
const DetailNotification = ({ route }) => {
    const { itemNotifications } = route.params;
    const { userData } = useAuth();
    const [teacher, setTeacher] = useState([]);
    console.log(userData)


    const [
        id,
        status,
        from_user,
        to_user,
        sent_time,
        message,
        type,
    ] = itemNotifications;



    // const getClassInfo = async (classId) => {}

    const getTeacherFromId = async (id) => {
        try {
            const response = await fetch(`http://157.66.24.126:8080/it4788/get_user_info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token,
                    userId: id
                })
            })
            if (response.status === 200) {
                const data = await response.json();
                setTeacher(data.data);
                console.log(data.data);
            } else {
                console.log("Error fetching teacher");
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (from_user) {
            getTeacherFromId(from_user);
        }
        else {
            console.log("No from_user");
            Alert.alert("No from_user");
        }
    }, []);



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết thông báo</Text>
            <Text style={styles.detail}>ID: {id}</Text>
            <Text style={styles.detail}>Trạng thái: {status}</Text>
            <Text style={styles.detail}>Gửi đến sinh viên: {userData.ho} {userData.ten}</Text>
            <Text style={styles.detail}>Giờ gửi: {sent_time}</Text>
            <Text style={styles.detail}>Nội dung thông báo: {message}</Text>
            <Text style={styles.detail}>Kiểu thông báo: {type}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    detail: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default DetailNotification;