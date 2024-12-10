import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';

const ChatScreen = () => {
    const { userData, fetchUnreadCount } = useAuth();
    const navigation = useNavigation();
    const [conversations, setConversations] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        fetchConversations(0);
    }, []);

    const fetchConversations = async (currentPage = 0, append = false) => {
        try {
            const response = await axios.post('http://157.66.24.126:8080/it5023e/get_list_conversation', {
                token: userData.token,
                index: currentPage * ITEMS_PER_PAGE,
                count: ITEMS_PER_PAGE.toString(),
            });

            if (response.data.meta.code === '1000') {
                const data = response.data.data.conversations;
                setHasMore(data.length === ITEMS_PER_PAGE);
                setConversations((prev) => (append ? [...prev, ...data] : data));
                fetchUnreadCount(); // Cập nhật số lượng tin nhắn chưa đọc
            } else {
                console.error('Error fetching conversations:', response.data.meta.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setPage(0); // Reset trang về 0
        await fetchConversations(0); // Làm mới danh sách
    };

    const loadNextPage = () => {
        if (hasMore && !loadingMore) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            fetchConversations(nextPage, true); // Tải thêm danh sách
        }
    };

    const renderConversation = ({ item }) => {
        const isUnread =
            item.last_message &&
            item.last_message?.unread !== 0 &&
            item.last_message?.sender?.id !== userData.id;

        return (
            <TouchableOpacity
                style={[
                    styles.conversationItem,
                    isUnread && styles.unreadConversationItem,
                ]}
                onPress={() =>
                    navigation.navigate('ConversationScreen', {
                        conversationId: item.id,
                        partnerId: item.partner.id,
                        partnerName: item.partner.name,
                    })
                }
            >
                <Text
                    style={[
                        styles.partnerName,
                        isUnread && styles.unreadPartnerName,
                    ]}
                >
                    {item.partner.name}
                </Text>
                <Text
                    style={[
                        styles.lastMessage,
                        isUnread && styles.unreadLastMessage,
                    ]}
                >
                    {item.last_message
                        ? item.last_message.message
                        : 'No messages yet'}
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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                onEndReached={loadNextPage}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    hasMore ? (
                        <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
                    ) : (
                        <Text style={styles.noMoreText}>Không còn cuộc trò chuyện</Text>
                    )
                }
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
        backgroundColor: '#f0f8ff',
    },
    partnerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    unreadPartnerName: {
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    unreadLastMessage: {
        fontWeight: 'bold',
        color: '#000',
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
    loadingMoreText: {
        textAlign: 'center',
        paddingVertical: 10,
        fontSize: 16,
        color: '#888',
    },
    noMoreText: {
        textAlign: 'center',
        paddingVertical: 10,
        fontSize: 16,
        color: '#666',
    },
});

export default ChatScreen;
