import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';

const ChatScreen = () => {
    const { userData } = useAuth();
    const navigation = useNavigation();
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await axios.post('http://157.66.24.126:8080/it5023e/get_list_conversation', {
                token: userData.token,
                index: '0',
                count: '3',
            });

            if (response.data.meta.code === '1000') {
                setConversations(response.data.data.conversations);
            } else {
                console.error('Error fetching conversations:', response.data.meta.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const renderConversation = ({ item }) => {
        // Kiểm tra nếu tin nhắn cuối cùng chưa đọc (unread)
        console.log("dsds",item);
        const isUnread = item.last_message && item.last_message?.unread !== 0 && item.last_message?.sender?.id != userData.id;

        return (
            <TouchableOpacity
                style={[styles.conversationItem, isUnread && styles.unreadConversationItem]}
                onPress={() =>

                         navigation.navigate('ConversationScreen', {
                            conversationId: item.id,
                            partnerId: item.partner.id,
                            partnerName: item.partner.name,
                        })
                }
            >
                <Text style={[styles.partnerName, isUnread && styles.unreadPartnerName]}>
                    {item.partner.name}
                </Text>
                <Text style={[styles.lastMessage, isUnread && styles.unreadLastMessage]}>
                    {item.last_message ? item.last_message.message : 'No messages yet'}
                </Text>
            </TouchableOpacity>
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Đoạn chat</Text>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderConversation}
                ListEmptyComponent={<Text>No conversations found.</Text>}
            />
            <TouchableOpacity
                style={styles.newConversationButton}
                onPress={() => navigation.navigate('NewConversationScreen')}
            >
                <Text style={styles.newConversationText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f4f4',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    conversationItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
    },
    unreadConversationItem: {
        backgroundColor: '#f0f8ff', // Nền màu sáng hơn để thể hiện tin nhắn chưa đọc
    },
    partnerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    unreadPartnerName: {
        fontWeight: 'bold', // Tên đối tác in đậm cho tin nhắn chưa đọc
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    unreadLastMessage: {
        fontWeight: 'bold', // Tin nhắn cuối cùng in đậm cho tin nhắn chưa đọc
        color: '#000', // Màu chữ đậm hơn cho tin nhắn chưa đọc
    },
    newConversationButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007BFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    newConversationText: {
        fontSize: 30,
        color: '#fff',
    },
});

export default ChatScreen;