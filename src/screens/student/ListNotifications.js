import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import ItemNotification from '../../components/ItemNotification';
import { useAuth } from '../../navigators/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';

const Notifications = () => {
    const { userData, get_unread_notifications } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0); // Trang hiện tại
    const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu không
    const ITEMS_PER_PAGE = 20; // Số lượng thông báo mỗi trang
    const [loadingMore, setLoadingMore] = useState(false); // Trạng thái tải thêm

    const get_notifications = async (currentPage = 0, append = false) => {
        try {
            const response = await fetch('http://157.66.24.126:8080/it5023e/get_notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token,
                    index: currentPage * ITEMS_PER_PAGE,
                    count: ITEMS_PER_PAGE,
                }),
            });

            if (response.status === 200) {
                const data = await response.json();
                setHasMore(data.data.length === ITEMS_PER_PAGE); // Nếu ít hơn 20, không còn dữ liệu
                setNotifications((prev) =>
                    append ? [...prev, ...data.data] : data.data
                );
            } else {
                console.log('Error fetching notifications');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMore(false); // Kết thúc trạng thái tải thêm
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await get_notifications(0);
        get_unread_notifications();
        setPage(0); // Reset lại trang về 0
        setRefreshing(false);
    };

    const loadNextPage = () => {
        if (hasMore && !loadingMore) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            get_notifications(nextPage, true);
        }
    };

    useFocusEffect(
        useCallback(() => {
            get_notifications();
            get_unread_notifications();
        }, [])
    );

    return (
        <View style={styles.container}>
            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    renderItem={({ item }) => <ItemNotification {...item} />}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    onEndReached={loadNextPage} // Tải thêm khi cuộn đến cuối danh sách
                    onEndReachedThreshold={0.5} // Kích hoạt khi gần cuối
                    ListFooterComponent={
                        hasMore ? (
                            <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
                        ) : (
                            <Text style={styles.noMoreText}>Không còn thông báo</Text>
                        )
                    }
                />
            ) : (
                <View style={styles.noNotificationsContainer}>
                    <Text style={styles.noNotificationsText}>
                        Không có thông báo
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 10,
        flex: 1,
    },
    noNotificationsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noNotificationsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#888',
        textAlign: 'center',
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

export default Notifications;
