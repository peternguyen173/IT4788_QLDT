import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../navigators/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { TextDecoder, TextEncoder } from 'text-encoding';
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const NewConversationScreen = () => {
    const { userData, fetchUnreadCount } = useAuth();
    const navigation = useNavigation();
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const PAGE_SIZE = 10;

    const searchUsers = async (query, currentPage = 0, append = false) => {
        if (!query) {
            setSearchResults([]);
            setPage(0);
            setHasMore(false);
            return;
        }

        try {
            const response = await axios.post('http://157.66.24.126:8080/it5023e/search_account', {
                token: userData.token,
                search: query,
                pageable_request: {
                    page: currentPage.toString(),
                    page_size: PAGE_SIZE.toString(),
                },
            });

            if (response.data.meta.code === '1000') {
                const data = response.data.data.page_content;
                setHasMore(data.length === PAGE_SIZE); // Nếu dữ liệu ít hơn PAGE_SIZE, không còn dữ liệu
                setSearchResults((prev) => (append ? [...prev, ...data] : data));
            }
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const loadNextPage = () => {
        if (hasMore && !loadingMore) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            searchUsers(searchInput, nextPage, true);
        }
    };

    const startConversation = (user) => {
        navigation.navigate('ConversationScreen', {
            partnerId: user.account_id,
            partnerName: user.first_name + ' ' + user.last_name,
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search for a user..."
                value={searchInput}
                onChangeText={(text) => {
                    setSearchInput(text);
                    setPage(0);
                    setHasMore(true);
                    searchUsers(text);
                }}
            />
            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.account_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.userItem}
                        onPress={() => startConversation(item)}
                    >
                        <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>No users found.</Text>}
                onEndReached={loadNextPage}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    hasMore ? (
                        <Text style={styles.loadingMoreText}>Loading more...</Text>
                    ) : (
                        <Text style={styles.noMoreText}>No more users</Text>
                    )
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f4f4',
    },
    searchInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 16,
    },
    userItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
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

export default NewConversationScreen;
