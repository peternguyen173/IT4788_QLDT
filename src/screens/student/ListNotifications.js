import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import ItemNotification from '../../components/ItemNotification';
import { useAuth } from '../../navigators/AuthProvider';

import { useFocusEffect } from '@react-navigation/native';




const Notifications = () => {
    const { userData, setUnreadNotifications, unreadNotifications, get_unread_notifications } = useAuth();
    const [notifications, setNotifications] = useState([]);
    // const [unreadNotifications, setUnreadNotifications] = useState(0);
    // const [selectedNotification, setSelectedNotification] = useState();
    const [refreshing, setRefreshing] = useState(false); // Thêm trạng thái làm mới


    const get_notifications = async () => {
        try {
            const response = await fetch('http://157.66.24.126:8080/it5023e/get_notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token,
                    index: 0,
                    count: 50
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                setNotifications(data.data);

            } else {
                console.log("Error fetching notifications");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onRefresh = async () => {
        setRefreshing(true); // Hiển thị vòng tròn tải
        await get_notifications(); // Tải lại danh sách thông báo
        get_unread_notifications()
        setRefreshing(false); // Tắt vòng tròn tải
    };

    useFocusEffect(
        useCallback(() => {
            get_notifications();
            get_unread_notifications()
        }, [])
    );

    return (
        <View style={styles.container}>

            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <ItemNotification
                        {...item}

                    />
                )}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 10,
        flex: 1,
        flexDirection: 'column',
    },
    textProps: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    markReadButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    markReadButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default Notifications;