import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../navigators/AuthProvider";
import { Image } from "react-native";

export default function Submit({ navigation, route }) {
  const { item } = route.params;
  const { userData, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState(false);
  const [fileText, setFileText] = useState(false);

  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState({
    uri: Image.resolveAssetSource(require("../../assets/2.png")).uri,
    type: "image/png",
    name: "2.png",
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;

      setFile({
        uri: selectedImageUri,
        type: result.assets[0].mimeType || "image/jpeg",
        name: result.assets[0].fileName || "uploaded_image.jpg",
      });
      setPic(true)
      setFileText(true)
    } else {
      alert("No image selected or an error occurred.");
    }
  };

  const SubmitAnswer = async () => {
    const formData = new FormData();

    // Thêm các trường khác
    formData.append("token", userData.token);
    formData.append("assignmentId", item.id);
    formData.append("textRespone", answer);

    // Thêm file vào FormData
    formData.append("file", file);

    try {
      setLoading(true);
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
            onPress: () =>
                navigation.navigate("BTStudent", { classId: item.class_id }),
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
        Alert.alert(
            "Bạn đã nộp bài này rồi.",
            "Mỗi sinh viên chỉ có thể nộp bài một lần.",
            [
              {
                text: "OK",
                onPress: () =>
                    navigation.navigate("UpcomingSubmission", { item }),
              },
            ]
        );
      } else {
        Alert.alert("Lỗi", "Vui lòng thử lại sau.", { text: "OK" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        {loading ? (
            <ActivityIndicator size="large" color="#d32f2f" style={styles.loader} />
        ) : (
            <View style={styles.form}>
              <TextInput style={styles.input} value={item.title} editable={false} />
              <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Bài làm"
                  placeholderTextColor="#B22222"
                  multiline={true}
                  numberOfLines={4}
                  maxLength={2000}
                  onChangeText={(newText) => setAnswer(newText)}
                  value={answer}
              />
              <Text style={{ fontSize: 11, color: "#B22222", marginTop: 10 }}>
                {answer.length}/2000 ký tự
              </Text>
              <Text style={styles.orText}>Hoặc</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>Tải tài liệu lên ▲</Text>
              </TouchableOpacity>
              {fileText && (
                  <Text style={{ fontSize: 11 }}>
                    <Text>Selected File: </Text>
                    {file.name}
                  </Text>
              )}

              <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    if (!answer.trim() && !pic) {
                      Alert.alert("Lỗi", "Bạn cần điền câu trả lời hoặc tải tài liệu lên.");
                      return;
                    }
                    SubmitAnswer()
                  }}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
        )}
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
    margin: 30,
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#B22222",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: 180,
    marginBottom: 5,
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
    marginTop: 30
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});