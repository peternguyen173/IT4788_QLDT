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

const PassDueSubmission = ({ navigation,route}) => {
  const { userData, logout } = useAuth();
  const { item } = route.params;


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

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
          <Text style={styles.label}>Đã quá hạn nộp bài ! </Text>
          <Text>
          <Text style={styles.label}>Hạn nộp: </Text>
          {formatDate(item.deadline)}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} value={item.title} editable={false} />
        <TouchableOpacity
          style={styles.downloadButton}
           onPress={() => Linking.openURL(item.file_url)}
        >
          <Text style={styles.uploadButtonText}>Mở file </Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={item.description}
          editable={false}
          multiline={true}
          numberOfLines={4}
        />
        {/* <TextInput
            style={[styles.input, styles.score]}
            value={score}
            editable={false}
            textAlign="center"
            fontSize={15} // Tăng kích thước font lên 20
            fontWeight="bold" // Đặt font đậm
        /> */}
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
  score:{
    padding: 5,
    width: 130,
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
    marginTop: 15,
    marginBottom: 15,
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

export default PassDueSubmission;