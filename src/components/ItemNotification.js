import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useAuth } from '../navigators/AuthProvider';

const ItemNotification = ({
    id,
    status,
    from_user,
    to_user,
    sent_time,
    message,
    type,
    onToggleSelect,
    isSelected,
 
}) => {
    const itemNotifications = [id, status, from_user, to_user, sent_time, message, type];
    const { userData } = useAuth();
    
    const navigation = useNavigation();
    const mark_notifications_as_read = async (id) => {

        try {
            const response = await fetch('http://157.66.24.126:8080/it5023e/mark_notification_as_read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token,
                    notification_id: id
                })
            });
            console.log(response);
            if (response.status === 200) {
                // Reset selected notifications and refresh data
                console.log("Marked notifications as read");

            } else {
                console.log("Error marking notifications as read");
            }
        } catch (error) {
            console.error(error);
        }
    }
    const handlePressDetail = async () => {
        navigation.navigate('DetailNotification', { itemNotifications: itemNotifications });
        await mark_notifications_as_read(id);
        
    }

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: status === 'UNREAD' ? 'lightgray' : 'white',
                borderColor: isSelected ? 'blue' : '#ccc'
            }
        ]}>
            {/* <View style={styles.checkboxContainer}>
                <BouncyCheckbox
                    size={25}
                    fillColor="blue"
                    unfillColor="#FFFFFF"
                    iconStyle={{ borderColor: "blue" }}
                    isChecked={isSelected}
                    onPress={onToggleSelect}
                />
            </View> */}
            <View style={styles.contentContainer}>
                <View style={styles.headContent}>
                    <Text style={{ color: 'red' }}>eHust</Text>
                    <Text style={{ fontWeight: 'thin' }}>{sent_time}</Text>
                </View>

                <View style={styles.bodyContent}>
                    <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{message}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.footContent}>
                    <Text>{type}</Text>
                </View>

                <View style={styles.linkContent}>
                    <TouchableOpacity onPress={handlePressDetail}>
                        <Text style={{ textDecorationLine: 'underline' }}>Chi tiết</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxContainer: {
        marginRight: 10,
    },
    contentContainer: {
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    headContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bodyContent: {
        marginTop: 10,
        paddingVertical: 10,
    },
    footContent: {
        paddingVertical: 10,
    },
    linkContent: {
        alignItems: 'flex-end',
    }
});

export default ItemNotification;