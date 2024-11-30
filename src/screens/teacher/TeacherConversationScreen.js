import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useAuth } from '../../navigators/AuthProvider';
import axios from 'axios';
import { TextEncoder, TextDecoder } from 'text-encoding';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import * as MediaLibrary from 'expo-media-library'; // Import MediaLibrary for saving images

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const TeacherConversationScreen = ({ route }) => {
    const { conversationId, partnerId, partnerName } = route.params;
    const { userData } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const flatListRef = useRef(); // Reference for FlatList

    const fetchConversation = async () => {
        try {
            const payload = {
                token: userData.token,
                index: '0',
                count: '20',
                mark_as_read: 'true',
            };

            if (conversationId) {
                payload.conversation_id = conversationId.toString();
            } else if (partnerId) {
                payload.partner_id = partnerId.toString();
            }

            const response = await axios.post(
                'http://157.66.24.126:8080/it5023e/get_conversation',
                payload
            );

            if (response.data.meta.code === '1000') {
                // Reverse the messages to maintain the desired order
                setMessages(response.data.data.conversation.reverse());
            } else {
                Alert.alert('Error', response.data.meta.message);
            }
        } catch (error) {
            console.error('Error fetching conversation:', error);
            Alert.alert('Error', 'Failed to fetch conversation.');
        }
    };

    useEffect(() => {
        fetchConversation();
    }, []);

    useEffect(() => {
        const socket = new SockJS('http://157.66.24.126:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            setStompClient(client);

            client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, newMessage]);

                // Scroll to the latest message
                setTimeout(() => {
                    if (flatListRef.current) {
                        flatListRef.current.scrollToEnd({ animated: true });
                    }
                }, 150);
            });
        }, (error) => {
            console.error('WebSocket connection error:', error);
            Alert.alert('Error', 'Failed to connect to WebSocket.');
        });

        return () => {
            if (client) client.disconnect();
        };
    }, [conversationId]);

    const sendMessage = () => {
        if (!inputMessage.trim()) {
            Alert.alert('Error', 'Message cannot be empty.');
            return;
        }

        if (!stompClient || !stompClient.connected) {
            Alert.alert('Error', 'WebSocket is not connected.');
            return;
        }

        const message = {
            receiver: { id: partnerId },
            content: inputMessage,
            sender: userData.email,
            token: userData.token,
        };

        try {
            stompClient.send('/chat/message', {}, JSON.stringify(message));
            console.log('Sending message:', message);

            const newMessage = {
                sender: { id: userData.id, avatar: userData.avatar },
                message: inputMessage,
                created_at: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, newMessage]);

            setTimeout(() => {
                if (flatListRef.current) {
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }, 100);

            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message.');
        }
    };

    const takePhoto = async () => {
        // Request camera permissions
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.status !== 'granted') {
            Alert.alert("Permission Denied", "You need to grant camera permissions to use this feature.");
            return;
        }

        // Launch the camera
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false, // No cropping/editing
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;

            // Request permission to access Media Library
            const mediaPermission = await MediaLibrary.requestPermissionsAsync();
            if (mediaPermission.status !== 'granted') {
                Alert.alert("Permission Denied", "You need to grant media library permissions to save this photo.");
                return;
            }

            // Save image to Media Library
            try {
                await MediaLibrary.createAssetAsync(selectedImageUri);
                Alert.alert('Success', 'Photo taken and saved successfully.');
            } catch (error) {
                console.error('Error saving photo:', error);
                Alert.alert('Error', 'Failed to save the photo.');
            }
        } else {
            Alert.alert('Error', 'No photo taken or an error occurred.');
        }
    };

    const transformGoogleDriveLink = (link) => {
        if (link.includes('drive.google.com')) {
            const fileId = link.split('/d/')[1]?.split('/')[0];
            return `https://drive.google.com/uc?id=${fileId}`;
        }
        return link; // Return original link if it's not a Google Drive link
    };

    const renderMessage = ({ item, index }) => {
        const isSentByCurrentUser = item.sender.id == userData.id;

        const showDateHeader = index === 0 || new Date(item.created_at).toDateString() !== new Date(messages[index - 1].created_at).toDateString();

        return (
            <>
                {showDateHeader && (
                    <Text style={styles.dateHeader}>
                        {new Date(item.created_at).toDateString()}
                    </Text>
                )}
                <View
                    style={[
                        styles.messageRow,
                        isSentByCurrentUser ? styles.sentRow : styles.receivedRow,
                    ]}
                >
                    {!isSentByCurrentUser && (
                        <Image source={{ uri: transformGoogleDriveLink(item.sender.avatar) }} style={styles.avatar} />
                    )}

                    <View
                        style={[
                            styles.messageBubble,
                            isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage,
                        ]}
                    >
                        {item.imageUrl ? (
                            <Image source={{ uri: item.imageUrl }} style={styles.imageMessage} />
                        ) : (
                            <Text style={styles.messageText}>{item.message}</Text>
                        )}
                        <Text style={styles.timestamp}>
                            {new Date(item.created_at).toLocaleTimeString()}
                        </Text>
                    </View>
                </View>
            </>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{partnerName}</Text>
            </View>

            <FlatList
                ref={flatListRef} // Attach reference to FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={[styles.messageList, { paddingBottom: 0 }]} // Add paddingBottom
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                }
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChangeText={setInputMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                    <Text style={styles.sendButtonText}>📷</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    header: {
        padding: 16,
        backgroundColor: '#007BFF',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    messageList: {
        padding: 16,
        paddingTop: 2,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    sentRow: {
        justifyContent: 'flex-end',
    },
    receivedRow: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        maxWidth: '75%',
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1f7c4',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    messageText: {
        fontSize: 16,
    },
    imageMessage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 5,
    },
    dateHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
        marginVertical: 10,
    },
    inputContainer: {
        marginTop: 10,
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    imageButton: {
        marginLeft: 10,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TeacherConversationScreen;
