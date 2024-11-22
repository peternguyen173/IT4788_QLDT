import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const ItemNotification = ({
    id, 
    status, 
    from_user, 
    to_user, 
    sent_time, 
    message, 
    type, 
    onToggleSelect,
    isSelected
}) => {
    const navigation = useNavigation();

    const handlePressDetail = () => {
        navigation.navigate('DetailNotification');
    }

    return (
        <View style={[
            styles.container, 
            {
                backgroundColor: status === 'UNREAD' ? 'lightgray' : 'white',
                borderColor: isSelected ? 'blue' : '#ccc'
            }
        ]}>
            <View style={styles.checkboxContainer}>
                <BouncyCheckbox
                    size={25}
                    fillColor="blue"
                    unfillColor="#FFFFFF"
                    iconStyle={{ borderColor: "blue" }}
                    isChecked={isSelected}
                    onPress={onToggleSelect}
                />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headContent}>
                    <Text style={{color:'red'}}>eHust</Text>
                    <Text style={{fontWeight:'thin'}}>{sent_time}</Text>
                </View>

                <View style={styles.bodyContent}>
                    <Text style={{fontWeight:'bold', fontSize:24}}>{message}</Text>
                </View>

                <View style={styles.divider}/>

                <View style={styles.footContent}>
                    <Text>{type}</Text>
                </View>

                <View style={styles.linkContent}>
                    <TouchableOpacity onPress={handlePressDetail}>
                        <Text style={{textDecorationLine: 'underline'}}>Chi tiết</Text>
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