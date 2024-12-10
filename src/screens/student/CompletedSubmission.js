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

const CompletedSubmission = ({ navigation,route}) => {
  const { userData, logout } = useAuth();
  const { id, title } = route.params;
  const [data, setData] = useState([]);
  const [score, setScore] = useState();


  useEffect(() => {
    getSubmission();
  }, []);

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


  const getSubmission = async () => {
    try {
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/get_submission",
        {
          token: userData.token,
          assignment_id: id, 
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      setData(response.data.data);
      if (response.data.data.grade == null) {
        setScore("Chưa có điểm !");
      } else {
        setScore("Điểm:  " + response.data.data.grade)
      }

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
          "Vui lòng thử lại sau."
        );
      }
    } finally {
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
          <Text style={styles.label}>Đã hoàn thành !</Text>
          <Text>
          <Text style={styles.label}>Ngày nộp: </Text>
          {formatDate(data.submission_time)}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} value={title} editable={false} />
        <TouchableOpacity
          style={styles.downloadButton}
           onPress={() => Linking.openURL(data.file_url)}
        >
          <Text style={styles.uploadButtonText}>Mở file </Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={data.text_response}
          editable={false}
          multiline={true}
          numberOfLines={4}
        />
        <Text style={{fontSize:15, fontWeight:"bold", marginTop:30}}> {score}</Text>
      </View>
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
  
  scoreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  downloadButton: {
    backgroundColor: "#B22222",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: 250,
    marginTop: 30,
    marginBottom: 30,
  },
  scoreButton:{
    width: 100,
  },
  textArea: {
    height: 250,
    textAlignVertical: "top",
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CompletedSubmission;
