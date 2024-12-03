import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import ItemNotification from '../../components/ItemNotification';
import { useAuth } from '../../navigators/AuthProvider';





const Notifications = () => {
    const { userData } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    // const [selectedNotification, setSelectedNotification] = useState();
    const [refreshing, setRefreshing] = useState(false); // Thêm trạng thái làm mới


    console.log("User data:", userData);

    const get_unread_notifications = async () => {
        try {
            const response = await fetch('http://157.66.24.126:8080/it5023e/get_unread_notification_count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                setUnreadNotifications(data.data);
            } else {
                console.log("Error fetching unread notifications");
            }
        } catch (error) {
            console.error(error);
        }
    }

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
                    count: 10
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                setNotifications(data.data);
                console.log(data.data);
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
        await get_unread_notifications(); // Cập nhật số thông báo chưa đọc
        setRefreshing(false); // Tắt vòng tròn tải
    };

    useEffect(() => {
        get_notifications();
        get_unread_notifications();
    }, []);

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