import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ItemNotification from '../../components/ItemNotification';
import { useAuth } from '../../navigators/AuthProvider';

const Notifications = () => {
    const { userData } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [selectedNotifications, setSelectedNotifications] = useState([]);

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
            } else {
                console.log("Error fetching notifications");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const mark_notifications_as_read = async () => {
        if (selectedNotifications.length === 0) return;

        const notificationIdsAsString = selectedNotifications.map(id => id.toString());
        console.log("Notification IDs as string:", notificationIdsAsString);
        try {
            const response = await fetch('http://157.66.24.126:8080/it5023e/mark_notification_as_read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token,
                    notification_ids: selectedNotifications
                })
            });
            console.log(response);
            if (response.status === 200) {
                // Reset selected notifications and refresh data
                setSelectedNotifications([]);
                get_notifications();
                get_unread_notifications();
            } else {
                console.log("Error marking notifications as read");
            }
        } catch (error) {
            console.error(error);
        }
    }



    const toggleNotificationSelection = (notificationId) => {
        setSelectedNotifications(prev =>
            prev.includes(notificationId)
                ? prev.filter(id => id !== notificationId)
                : [...prev, notificationId]
        );
    }

    useEffect(() => {
        get_notifications();
        get_unread_notifications();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.textProps}>List Notification</Text>
            <Text style={styles.textProps}>Unread Notification: {unreadNotifications}</Text>
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <ItemNotification
                        {...item}
                        onToggleSelect={() => toggleNotificationSelection(item.id)}
                        isSelected={selectedNotifications.includes(item.id)}
                    />
                )}
                keyExtractor={item => item.id.toString()}
            />

            {selectedNotifications.length > 0 && (
                <TouchableOpacity
                    style={styles.markReadButton}
                    onPress={() => mark_notifications_as_read()}
                >
                    <Text style={styles.markReadButtonText}>
                        Mark {selectedNotifications.length} Notification(s) as Read
                    </Text>
                </TouchableOpacity>
            )}
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