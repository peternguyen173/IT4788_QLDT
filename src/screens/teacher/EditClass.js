import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import { useAuth } from "../../navigators/AuthProvider";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditClass = () => {
  const { userData } = useAuth();
  const [classId, setClassId] = useState("IT4790");
  const [className, setClassName] = useState("Phát triển ứng dụng di động");
  const [learningCode, setLearningCode] = useState("IT4790");
  const [classCode, setClassCode] = useState("IT4790");
  const [classType, setClassType] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [maxStudent, setMaxStudent] = useState("50");

  const handleDateChange = (event, selectedDate, isStartDate) => {
    if (Platform.OS === "android") {
      isStartDate ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
    }
    if (selectedDate) {
      isStartDate ? setStartDate(selectedDate) : setEndDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.input}
          placeholder="Mã lớp *"
          value={classId}
          onChangeText={setClassId}
        />
        <TextInput
          style={styles.input}
          placeholder="Mã lớp kèm *"
          value={classCode}
          onChangeText={setClassCode}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên lớp *"
          value={className}
          onChangeText={setClassName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mã học phần *"
          value={learningCode}
          onChangeText={setLearningCode}
        />
        <View style={styles.dropDownInput}>
          <Picker
            placeholder="Loại lớp *"
            selectedValue={classType}
            onValueChange={(itemValue, itemIndex) => setClassType(itemValue)}
          >
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>
        </View>
        <View style={styles.rowView}>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Text>{startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, date) => handleDateChange(event, date, true)}
              />
            )}
          </View>
          <View style={{ width: 20 }} />
          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text>{endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, date) => handleDateChange(event, date, false)}
              />
            )}
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Số lượng sinh viên tối đa"
          value={maxStudent}
          onChangeText={setMaxStudent}
        />

        <TouchableOpacity style={styles.bottomButton} onPress={() => {}}>
          <Text style={styles.buttonText}>Tạo lớp học</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.bottomText}>Thông tin danh sách các lớp mở</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    height: 60,
  },
  dropDownInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    height: 60,
  },
  datePickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    height: 60,
    flex: 1,
    justifyContent: "center",
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    width: "40%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontStyle: "italic",
  },
  bottomText: {
    color: "#d32f2f",
    fontStyle: "italic",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});

export default EditClass;
