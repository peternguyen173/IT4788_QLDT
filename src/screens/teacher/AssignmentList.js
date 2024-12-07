import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

import axios from "axios";
import { useAuth } from "../../navigators/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";

const AssignmentList = ({ navigation, route }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData, logout } = useAuth();
  const { title, id } = route.params;
  const [score, setScore] = useState();

  useEffect(() => {
    fetchAssignments();
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchAssignments();
    }, [])
  );


  function formatDate(dateString) {
    // Chuyển chuỗi thành đối tượng Date
    const date = new Date(dateString);

    // Lấy các thành phần ngày, tháng, năm, giờ, phút
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Tạo chuỗi kết quả theo định dạng mong muốn
    const formattedDate = `${day} tháng ${month} năm ${year} ${hours}:${minutes
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  }

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_survey_response",
        {
          token: userData.token,
          survey_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      setAssignments(response.data.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        // Nếu token không hợp lệ hoặc đã hết hạn, đăng xuất
        Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.", [
          { text: "OK", onPress: () => logout() },
        ]);
      } else {
        Alert.alert("Lỗi", "Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  function checkScore(grade) {
    if (grade != null)
      return (
        <Text style={{ fontSize: 16 }}>
          <Text style={styles.name}>Điểm: </Text>
          <Text> {grade}</Text>
        </Text>
      );
    else
      return (
        <Text style={{ fontSize: 16 }}>
          <Text style={styles.name}>Chưa chấm điểm </Text>
        </Text>
      );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.classCard}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("RatingAssignment", { item, title });
          }}
        >
          <Text style={{ fontSize: 16 }}>
            <Text style={styles.name}>Sinh viên: </Text>
            <Text>
              {" "}
              {item.student_account.first_name +
                " " +
                item.student_account.last_name}
            </Text>
          </Text>
          <Text style={{ fontSize: 16 }}>
            <Text style={styles.name}>Ngày nộp:</Text>
            <Text> {formatDate(item.submission_time)}</Text>
          </Text>
          {checkScore(item.grade)}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#d32f2f" style={styles.loader} />
      ) : (
        <View>
          <FlatList
            data={assignments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="school-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Không có bài nộp nào</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },

  containerbtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#F3F4F6", // Gray-100
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9999,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  buttonText: {
    color: "#4B5563", // Gray-700
  },

  container: {
    flex: 1,
    // backgroundColor: "#d32f2f",
  },
  listContainer: {
    padding: 16,
  },

  classCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#B22222",
    borderWidth: 1,
  },
  cardHeader: {
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
  },
  classType: {
    fontSize: 14,
    marginTop: 4,
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});

export default AssignmentList;
