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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useAuth } from "../../navigators/AuthProvider";
import { Image } from "react-native";

export default function CreateSurvey({ navigation, route }) {
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { classId } = route.params;
  const { userData, logout } = useAuth();

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(false); // Tắt picker sau khi chọn
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false); // Tắt picker sau khi chọn
    setEndDate(currentDate);
  };


  const CreateSurvey = async () => {
    const formData = new FormData();

    // Thêm các trường khác
    formData.append("token", userData.token);
    formData.append("classId", classId);
    formData.append("title", title);
    formData.append("deadline", "2024-12-02T12:08:00");
    formData.append("description", description);

    const fakeFile = {
      uri: Image.resolveAssetSource(require("../../assets/1.png")).uri,
      type: "image/png",
      name: "1.png",
    };

    // Thêm file giả vào FormData (hoặc truyền null nếu API chấp nhận)
    formData.append("file", fakeFile);

    try {
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
            onPress: () =>
              navigation.navigate("BTTeacher", { classId }),
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
        Alert.alert(
          "Lỗi",
          "Vui lòng thử lại sau."
        );
      }
    } finally {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Tên bài kiểm tra *"
          placeholderTextColor="#B22222"
          onChangeText={(newText) => setTitle(newText)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mô tả"
          placeholderTextColor="#B22222"
          multiline={true}
          numberOfLines={4}
          onChangeText={(newText) => setDescription(newText)}
        />
        <Text style={styles.orText}>Hoặc</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Tải tài liệu lên ▲</Text>
        </TouchableOpacity>
        <View style={styles.pickerContainer}>
          <Pressable
            onPress={() => setShowStartPicker(true)}
            style={styles.picker}
          >
            <Text style={styles.pickerText}>
              {startDate
                ? startDate.toLocaleDateString()
                : "Bắt đầu                ▼"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowEndPicker(true)}
            style={styles.picker}
          >
            <Text style={styles.pickerText}>
              {endDate
                ? endDate.toLocaleDateString()
                : "Kết thúc               ▼"}
            </Text>
          </Pressable>
        </View>
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => CreateSurvey()}
        >
          <Text style={styles.submitButtonText}>Tạo bài</Text>
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
    marginTop: 60,
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
    color: "#B22222",
    marginBottom: 30,
    marginTop: 30,
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#B22222",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: 180,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: 30,
  },
  picker: {
    flex: 1,
    borderColor: "#B22222",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 20,
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
});
