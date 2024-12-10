import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../navigators/AuthProvider";

const HistoryReqAbsence = ({ route }) => {
    const { classId } = route.params;
    const { userData } = useAuth();

    const [requests, setRequests] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const getStudentAbsenceRequests = async () => {
        if (loading || page >= totalPages) return;
        setLoading(true);
        try {
            const response = await fetch(
                "http://157.66.24.126:8080/it5023e/get_student_absence_requests",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: userData.token,
                        class_id: classId,
                        status: null,
                        pageable_request: {
                            page: page,
                            page_size: 4,
                        },
                    }),
                }
            );

            if (response.status === 200) {
                const data = await response.json();
                setRequests((prev) => [...prev, ...data.data.page_content]);
                setPage(data.data.page_info.page + 1);
                setTotalPages(data.data.page_info.total_page);
                console.log(data.data); 
            } else {
                console.log("Error fetching student absence requests");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudentAbsenceRequests();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title || "No Title"}</Text>
            <Text>Ngày nghỉ: {item.absence_date}</Text>
            <Text>Lý do: {item.reason}</Text>
            <Text>Trạng thái: {item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                ListFooterComponent={
                    loading ? (
                        <ActivityIndicator size="small" color="#0000ff" />
                    ) : page < totalPages ? (
                        <TouchableOpacity style={styles.loadMoreButton} onPress={getStudentAbsenceRequests}>
                            <Text style={styles.loadMoreText}>Tải thêm</Text>
                        </TouchableOpacity>
                    ) : null
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    loadMoreButton: {
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 10,
    },
    loadMoreText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default HistoryReqAbsence;
