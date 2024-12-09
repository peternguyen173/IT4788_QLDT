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



    const [
        id,
        status,
        from_user,
        to_user,
        sent_time,
        message,
        type,
    ] = itemNotifications;

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
            <Text style={styles.title}>Notification Details</Text>
            <Text style={styles.detail}>ID: {id}</Text>
            <Text style={styles.detail}>Status: {status}</Text>
            <Text style={styles.detail}>From User: {from_user}</Text>
            <Text style={styles.detail}>To User: {to_user}</Text>
            <Text style={styles.detail}>Sent Time: {sent_time}</Text>
            <Text style={styles.detail}>Message: {message}</Text>
            <Text style={styles.detail}>Type: {type}</Text>
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
