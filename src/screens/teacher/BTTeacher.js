import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import axios from "axios";
import { useAuth } from "../../navigators/AuthProvider";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";


const BTTeacher = ({ navigation, route }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData, logout } = useAuth();
  const { classId } = route.params;
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);
  useEffect(() => {
    fetchSurveys();
  }, [update]);

  useFocusEffect(
      useCallback(() => {
        fetchSurveys();
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

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
          "http://157.66.24.126:8080/it5023e/get_all_surveys",
          {
            token: userData.token,
            class_id: classId,
          },
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
      );
      setSurveys(response.data.data.reverse());
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

  const DeleteSurvey = async (id) => {
    try {
      setLoading(true)
      const response = await axios.post(
          "http://157.66.24.126:8080/it5023e/delete_survey",
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

      console.log(response.data);
      if (response.data.meta.code == "1000") {
        Alert.alert("Xóa bài tập thành công.", "", [
          { text: "OK" },
          setUpdate(!update),
        ]);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        // Nếu token không hợp lệ hoặc đã hết hạn, đăng xuất
        Alert.alert("Phiên đăng nhập hết hạn.", "Vui lòng đăng nhập lại.", [
          { text: "OK", onPress: () => logout() },
        ]);
      } else {
        Alert.alert("Lỗi", "Không thể xóa. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
        <View style={styles.classCard}>
          <TouchableOpacity
              onPress={() => {
                let id = item.id,
                    title = item.title;
                navigation.navigate("AssignmentList", { id, title });
              }}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>
              <Text style={styles.deadline}>Hết hạn: </Text> {formatDate(item.deadline)}
            </Text>
          </TouchableOpacity>

          <View style={styles.edit_trash}>

            <TouchableOpacity style={{ flex: 1 }}>
              <Feather name="eye" size={24} color="black"
                       onPress={() => {
                         navigation.navigate("HomeWork", { item });
                       }}
              />
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 3, marginBottom: 5 }}>
              <AntDesign
                  name="edit"
                  size={24}
                  color="black"
                  onPress={() => {
                    let id = item.id,
                        oldTitle = item.title;
                    navigation.navigate("EditSurvey", { classId, id, oldTitle });
                  }}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Feather
                  name="trash-2"
                  size={24}
                  color="black"
                  onPress={() => Alert.alert("Xác nhận !", "Bạn có chắn chắn muốn xóa bài tập này?", [
                    { text: "OK", onPress: () => DeleteSurvey(item.id) },
                    { text: "Hủy", style: "cancel" },
                  ])}
              />
            </TouchableOpacity>

          </View>
        </View>
    );
  };

  return (
      <View style={styles.container}>
        {loading ? (
            <ActivityIndicator size="large" color="#d32f2f" style={styles.loader} />
        ) : (
            <View>
              <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => navigation.navigate("CreateSurvey", { classId })}
              >
                <Text style={styles.uploadButtonText}>Tạo bài</Text>
              </TouchableOpacity>

              <FlatList
                  data={surveys}
                  renderItem={renderItem}
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
  deadline: {
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  uploadButton: {
    backgroundColor: "#B22222",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: 100,
    margin: 20,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
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
    paddingBottom: 100,
  },
  edit_trash: {
    alignContent: "space-between",
  },
  classCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: "#B22222",
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

export default BTTeacher;