import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useAuth } from "../../navigators/AuthProvider";
import { Image } from "react-native";

export default function CreateSurvey({ navigation, route }) {
  const [date, setDate] = useState(new Date()); // Lưu giá trị ngày/giờ được chọn
  const [mode, setMode] = useState("date"); // Chế độ: "date" hoặc "time"
  const [show, setShow] = useState(false); // Hiển thị picker hay không
  const [selectedDate, setSelectedDate] = useState(""); // Ngày đã chọn
  const [selectedTime, setSelectedTime] = useState(""); // Giờ đã chọn

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pic, setPic] = useState(false);
  const [file, setFile] = useState({
    uri: Image.resolveAssetSource(require("../../assets/2.png")).uri,
    type: "image/png",
    name: "2.png",
  });
  const [fileText, setFileText] = useState(false);

  const { classId } = route.params;
  const { userData, logout } = useAuth();

  const onChange = (event, selectedValue) => {
    setShow(false); // Ẩn picker sau khi chọn
    if (selectedValue) {
      const currentDate = selectedValue;
      setDate(currentDate);

      if (mode === "date") {
        const formattedDate = `${currentDate.getDate()}/${
          currentDate.getMonth() + 1
        }/${currentDate.getFullYear()}`;
        setSelectedDate(formattedDate);
      } else if (mode === "time") {
        const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
        setSelectedTime(formattedTime);
      }
    }
  };

  const convertToISOFormat = (dateString, timeString) => {
    // Tách ngày, tháng, năm từ chuỗi dateString
    const [day, month, year] = dateString.split("/").map(Number);

    // Tách giờ và phút từ chuỗi timeString
    const [hour, minute] = timeString.split(":").map(Number);

    // Tạo chuỗi theo định dạng ISO
    const isoString = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}:00`;

    return isoString;
  };

  const showMode = (currentMode) => {
    setMode(currentMode); // Đặt chế độ: chọn ngày hoặc giờ
    setShow(true); // Hiển thị picker
  };

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
      setPic(true);
      setFileText(true);
    } else {
      alert("No image selected or an error occurred.");
    }
  };

  function checkDescription(inputString) {
    // Kiểm tra nếu chuỗi không có ký tự nào (chỉ chứa khoảng trắng hoặc rỗng)
    if (!inputString.trim()) {
      setDescription("Không có mô tả cho đề bài.");
      return "Không có mô tả cho đề bài.";
    }
    // Nếu chuỗi có nội dung, trả về chuỗi ban đầu
    return inputString;
  }

  const CreateSurvey = async () => {
    const formData = new FormData();

    // Thêm file vào FormData
    formData.append("file", file);

    // Thêm các trường khác
    formData.append("token", userData.token);
    formData.append("classId", classId);
    formData.append("title", title);
    formData.append("deadline", convertToISOFormat(selectedDate, selectedTime));
    formData.append("description", checkDescription(description));

    try {
      setLoading(true);
      const response = await axios.post(
        "http://157.66.24.126:8080/it5023e/create_survey?file",
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
        Alert.alert("Tạo bài kiểm tra thành công", "", [
          {
            text: "OK",
            onPress: () => navigation.navigate("BTTeacher", { classId }),
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
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#d32f2f" style={styles.loader} />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Tên bài kiểm tra *"
              placeholderTextColor="#B22222"
              onChangeText={(newText) => setTitle(newText)}
              value={title}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mô tả"
              placeholderTextColor="#B22222"
              multiline={true}
              numberOfLines={4}
              maxLength={2000} // Giới hạn số ký tự tối đa
              onChangeText={(newText) => setDescription(newText)}
              value={description}
            />
            <Text style={{ fontSize: 11, color: "#B22222", marginTop: 10 }}>
              {description.length}/2000 ký tự
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

            <View style={styles.deadline}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "bold",
                    color: "#B22222",
                    marginTop: 2,
                  }}
                >
                  Hạn nộp
                </Text>
              </View>
              <View style={styles.pickerContainer}>
                <Pressable
                  // onPress={() => setShowStartPicker(true)}
                  onPress={() => showMode("date")}
                  style={[styles.picker, { marginBottom: 5 }]}
                >
                  <Text style={styles.pickerText}>
                    {selectedDate
                      ? selectedDate
                      : // .toLocaleDateString()
                        "Chọn ngày      ▼"}
                  </Text>
                </Pressable>
                <Pressable
                  // onPress={() => setShowEndPicker(true)}
                  onPress={() => showMode("time")}
                  style={styles.picker}
                >
                  <Text style={styles.pickerText}>
                    {selectedTime
                      ? selectedTime
                      : // .toLocaleDateString()
                        "Chọn giờ         ▼"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {show && (
              <DateTimePicker
                value={date} // Ngày/giờ mặc định
                mode={mode} // Chế độ hiện tại (date/time)
                is24Hour={true} // Sử dụng giờ 24h
                display="default" // Giao diện mặc định
                onChange={onChange} // Xử lý khi chọn
              />
            )}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                if (!title.trim()) {
                  Alert.alert("Lỗi", "Tên bài kiểm tra không được để trống.");
                  return;
                }
                if (!description.trim() && !pic) {
                  Alert.alert(
                    "Lỗi",
                    "Bạn cần mô tả bài tập hoặc tải tài liệu lên."
                  );
                  return;
                }
                if (!selectedDate || !selectedTime) {
                  Alert.alert("Lỗi", "Bạn chưa chọn thời gian cho hạn nộp.");
                  return;
                }
                CreateSurvey();
              }}
            >
              <Text style={styles.submitButtonText}>Tạo bài</Text>
            </TouchableOpacity>
          </View>
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
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
  },
  input: {
    borderColor: "#B22222",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 35,
    color: "#333",
    width: "100%",
    backgroundColor: "#f3f3f3",
  },
  textArea: {
    height: 250,
    textAlignVertical: "top",
  },
  orText: {
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
    fontWeight: "bold",
    color: "#B22222",
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
  deadline: {
    flexDirection: "row",
    margin: 30,
  },
  pickerContainer: {
    justifyContent: "flex-start",
    marginLeft: 35,
  },
  picker: {
    borderColor: "#B22222",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
  },
  pickerText: {
    color: "#B22222",
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
