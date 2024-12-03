import React, { useState } from "react";
import {
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    Text,
    Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import { useAuth } from "../../navigators/AuthProvider";

const CreateClass = ({ navigation }) => {
    const [classId, setClassId] = useState("");
    const [className, setClassName] = useState("");
    const [classType, setClassType] = useState(""); // LT, BT, LT_BT
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
    const [maxStudent, setMaxStudent] = useState("");
    const [attachedCode, setAttachedCode] = useState("");
    const { userData } = useAuth();

    const validateAndSubmit = async () => {
        if (classId.length !== 6) {
            Alert.alert("Lỗi", "Mã lớp phải có đúng 6 ký tự.");
            return;
        }
        if (!classId || !className || !classType || !startDate || !endDate || !maxStudent) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ các trường bắt buộc.");
            return;
        }

        // Format dates to YYYY-MM-DD
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];

        // Prepare payload
        const payload = {
            token: userData.token,
            class_id: classId,
            class_name: className,
            class_type: classType,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            max_student_amount: parseInt(maxStudent, 10),
            ...(attachedCode && { attached_code: attachedCode }), // Optional field
        };

        try {
            const response = await axios.post(
                "http://157.66.24.126:8080/it5023e/create_class",
                payload
            );

            const { data, meta } = response.data;

            if (meta.code === "1000") {
                Alert.alert("Thành công", `Lớp ${data.class_name} đã được tạo thành công!`);
                navigation.navigate("TeacherClassList");
            } else {
                Alert.alert("Lỗi", meta.message || "Đã xảy ra lỗi.");
            }
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Lỗi", "Không thể tạo lớp. Vui lòng thử lại sau.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Mã lớp (6 ký tự) *"
                value={classId}
                maxLength={6}
                onChangeText={setClassId}
            />
            <TextInput
                style={styles.input}
                placeholder="Tên lớp *"
                value={className}
                onChangeText={setClassName}
            />
            <View style={styles.dropDownInput}>
                <Picker
                    selectedValue={classType}
                    onValueChange={(value) => setClassType(value)}
                >
                    <Picker.Item label="Chọn loại lớp *" value="" />
                    <Picker.Item label="LT (Lý thuyết)" value="LT" />
                    <Picker.Item label="BT (Thực hành)" value="BT" />
                    <Picker.Item label="LT + BT" value="LT_BT" />
                </Picker>
            </View>
            <TouchableOpacity
                style={styles.datePickerContainer}
                onPress={() => setStartDatePickerVisibility(true)}
            >
                <Text>Ngày bắt đầu: {startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                    setStartDate(date);
                    setStartDatePickerVisibility(false);
                }}
                onCancel={() => setStartDatePickerVisibility(false)}
            />
            <TouchableOpacity
                style={styles.datePickerContainer}
                onPress={() => setEndDatePickerVisibility(true)}
            >
                <Text>Ngày kết thúc: {endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                    setEndDate(date);
                    setEndDatePickerVisibility(false);
                }}
                onCancel={() => setEndDatePickerVisibility(false)}
            />
            <TextInput
                style={styles.input}
                placeholder="Số lượng sinh viên tối đa *"
                value={maxStudent}
                keyboardType="numeric"
                onChangeText={setMaxStudent}
            />
            <TextInput
                style={styles.input}
                placeholder="Mã lớp kèm (Tùy chọn)"
                value={attachedCode}
                onChangeText={setAttachedCode}
            />
            <TouchableOpacity style={styles.submitButton} onPress={validateAndSubmit}>
                <Text style={styles.buttonText}>Tạo lớp học</Text>
            </TouchableOpacity>
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
        height: 50,
    },
    dropDownInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10,
        height: 50,
        justifyContent: "center",
    },
    datePickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        height: 50,
        justifyContent: "center",
    },
    submitButton: {
        backgroundColor: "#28a745",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default CreateClass;
