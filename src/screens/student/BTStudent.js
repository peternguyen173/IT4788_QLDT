import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useAuth } from "../../navigators/AuthProvider";
import Icon from "react-native-vector-icons/Ionicons";

const BTStudent = ({ navigation, route }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData, logout } = useAuth();
  const [duration, setDuration] = useState("UPCOMING");
  const { classId } = route.params;

  useEffect(() => {
    fetchClasses();
  }, [duration]);

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

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_student_assignments",
        {
          token: userData.token,
          type: duration,
          class_id: classId,
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
        Alert.alert(
          "Lỗi",
          "Không thể tải danh sách lớp. Vui lòng thử lại sau."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderClassItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.classCard}
        onPress={() => {
          if (duration == "UPCOMING")
            navigation.navigate("UpcomingSubmission",{item});
          else if (duration == "PASS_DUE")
            navigation.navigate("PassDueSubmission",{item});
          else
            navigation.navigate("CompletedSubmission",{id: item.id, title: item.title});
        }}
      >
        <Text style = {{fontSize: 15, fontWeight: "bold"}}>{item.title}</Text>
        <Text style = {{fontSize: 15}}>
          <Text style = {{fontWeight: "bold"}}>Hạn nộp:</Text>
          <Text> {formatDate(item.deadline)}</Text>
        </Text>
        
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#d32f2f" style={styles.loader} />
      ) : (
        <View>
          <View style={styles.containerbtn}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setDuration("UPCOMING")}
            >
              <Text style={styles.buttonText}>Sắp tới</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setDuration("PASS_DUE")}
            >
              <Text style={styles.buttonText}>Quá hạn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setDuration("COMPLETED")}
            >
              <Text style={styles.buttonText}>Đã hoàn thành</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={assignments}
            renderItem={renderClassItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="school-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Không có bài kiểm tra nào</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerbtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#B22222", // Gray-100
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9999,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  container: {
    flex: 1,
    // backgroundColor: "#d32f2f",
  },
  listContainer: {
    padding: 16,
  },
  classCard: {
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

export default BTStudent;
