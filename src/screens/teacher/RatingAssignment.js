import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Linking,
} from "react-native";
import axios from "axios";
import { useAuth } from "../../navigators/AuthProvider";
import { useNavigation } from "@react-navigation/native";

const RatingAssignment = ({ navigation, route }) => {
  const { item, title } = route.params;
  const { userData, logout } = useAuth();
  const [score, setScore] = useState();
  const [loading, setLoading] = useState(false);

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

  const fetchScore = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_survey_response",
        {
          token: userData.token,
          survey_id: item.assignment_id,
          grade: {
            score: score,
            submission_id: item.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      const { code } = response.data.meta || {};
      if (code == "1000") {
        Alert.alert("Chấm điểm thành công", "", [
          {
            text: "OK",
            onPress: () => {
              (id = item.assignment_id),
                navigation.navigate("AssignmentList", { title, id });
            },
          },
        ]);
      }
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

  return (
    <View style = {{flex: 1}}>
      {loading ? (
        <ActivityIndicator size="large" color="#d32f2f" style={styles.loader} />
      ) : (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text>
            <Text style={styles.label}>Họ tên: </Text>
            {item.student_account.first_name +
              " " +
              item.student_account.last_name}
          </Text>
          <Text>
            <Text style={styles.label}>MSSV: </Text>
            {item.student_account.student_id}
          </Text>
          <Text>
            <Text style={styles.label}>Email: </Text>
            {item.student_account.email}
          </Text>
          <Text>
            <Text style={styles.label}>Ngày nộp: </Text>
            {formatDate(item.submission_time)}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput style={styles.input} value={title} editable={false} />
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => Linking.openURL(item.file_url)}
          >
            <Text style={styles.uploadButtonText}>Mở file </Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={item.text_response}
            editable={false}
            multiline={true}
            numberOfLines={4}
          />

          <TextInput
            style={[styles.input, styles.score]}
            placeholder="Nhập điểm"
            placeholderTextColor="#B22222"
            onChangeText={(newText) => setScore(newText)}
            textAlign="center"
          />
          <TouchableOpacity
            style={[styles.downloadButton, styles.scoreButton]}
            onPress={() => fetchScore()}
          >
            <Text style={styles.uploadButtonText}>Chấm điểm </Text>
          </TouchableOpacity>
        </View>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "white",
  },
  infoContainer: {
    margin: 20,
  },
  label: {
    fontWeight: "bold",
  },

  form: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
  },
  input: {
    borderColor: "#B22222",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
    marginBottom: 15,
    color: "#333",
    width: "100%",
    backgroundColor: "#f3f3f3",
  },
  score: {
    padding: 5,
    width: 100,
  },
  scoreview: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  downloadButton: {
    backgroundColor: "#B22222",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: 250,
    marginTop: 15,
    marginBottom: 15,
  },
  scoreButton: {
    width: 100,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  textArea: {
    height: 250,
    textAlignVertical: "top",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RatingAssignment;
