import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import { useAuth } from "../../navigators/AuthProvider";
import { Image } from "react-native";

export default function Submit({ navigation, route }) {
  const { item } = route.params;
  const { userData, logout } = useAuth();

  const [answer, setAnswer] = useState();

  const SubmitAnswer = async () => {
    console.log("" + userData.token + " " + item.id + " " + answer);
    const formData = new FormData();

    // Thêm các trường khác
    formData.append("token", userData.token);
    formData.append("assignmentId", item.id);
    formData.append("textRespone", answer);

    const fakeFile = {
      uri: Image.resolveAssetSource(require("../../assets/1.png")).uri,
      type: "image/png",
      name: "1.png",
    };

    // Thêm file giả vào FormData (hoặc truyền null nếu API chấp nhận)
    formData.append("file", fakeFile);

    try {
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/submit_survey?file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      const { code } = response.data.meta || {};
      if (code == "1000") {
        Alert.alert("Nộp bài kiểm tra thành công", "", [
          {
            text: "OK",
            onPress: () => navigation.navigate("UpcomingSubmission", { item }),
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
      } else if (error.response && error.response.status === 400) {
        // Nếu token không hợp lệ hoặc đã hết hạn, đăng xuất
        Alert.alert("Bạn đã nộp bài này rồi.", "Mỗi sinh viên chỉ có thể nộp bài một lần.", [
          { text: "OK", onPress: () => navigation.navigate("UpcomingSubmission", { item }) },
        ]);
      } else {
        Alert.alert("Lỗi", "Vui lòng thử lại sau.",{text: "OK"});
      }
    } finally {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput style={styles.input} value={item.title} editable={false} />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Bài làm"
          placeholderTextColor="#B22222"
          multiline={true}
          numberOfLines={4}
          onChangeText={(newText) => setAnswer(newText)}
        />
      </View>

      <View style={styles.view2}>
        <Text style={styles.orText}>Hoặc</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Tải tài liệu lên ▲</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => SubmitAnswer()}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  header: {
    backgroundColor: "#B22222",
    width: "100%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  backArrow: {
    color: "white",
    fontSize: 20,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  subHeaderText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#B22222",
    paddingVertical: 5,
  },
  form: {
    flex: 2,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
  },
  view2: {
    flex: 1,
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
    marginTop: 30,
    marginBottom: 15,
    color: "#333",
    width: "100%",
    backgroundColor: "#f3f3f3",
  },
  textArea: {
    height: 250,
    textAlignVertical: "top",
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
  orText: {
    textAlign: "center",
    color: "#B22222",
    marginBottom: 30,
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#B22222",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: 180,
    marginBottom: 30,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#B22222",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 100,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
