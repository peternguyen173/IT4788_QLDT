import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    Text,
    Alert,
} from "react-native";
import { useAuth } from "../../navigators/AuthProvider";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditClass = ({ route }) => {
    const { classId } = route.params; // Nhận classId từ route params

    const { userData } = useAuth();
    const [className, setClassName] = useState("");
    const [classType, setClassType] = useState("LT");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [status, setStatus] = useState("ACTIVE");
    const [maxStudent, setMaxStudent] = useState("");

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const { classData } = route.params || {}; // Lấy thông tin lớp từ tham số truyền vào

    useEffect(() => {
        if (classData) {
            setClassName(classData.class_name || "");
            setClassType(classData.class_type || "LT");
            setStartDate(new Date(classData.start_date) || new Date());
            setEndDate(new Date(classData.end_date) || new Date());
            setStatus(classData.status || "ACTIVE");
            setMaxStudent(classData.max_student_amount?.toString() || "");
        }
    }, [classData]);

    const handleDateChange = (event, selectedDate, isStartDate) => {
        if (isStartDate) {
            setShowStartDatePicker(false);
            setStartDate(selectedDate || startDate);
        } else {
            setShowEndDatePicker(false);
            setEndDate(selectedDate || endDate);
        }
    };

    const handleEditClass = async () => {
        if (!classId || !className || !maxStudent) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc.");
            return;
        }

        try {
            const response = await fetch("http://157.66.24.126:8080/it5023e/edit_class", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: userData?.token,
                    class_id: classId,
                    class_name: className,
                    status,
                    start_date: startDate.toISOString().split("T")[0],
                    end_date: endDate.toISOString().split("T")[0],
                }),
            });

            const result = await response.json();
            if (result.meta.code === "1000") {
                Alert.alert("Thành công", "Lớp học đã được cập nhật.");
            } else {
                Alert.alert("Lỗi", result.meta.message || "Cập nhật lớp học thất bại.");
            }
        } catch (error) {
            console.error("Error updating class:", error);
            Alert.alert("Lỗi", "Không thể cập nhật lớp học. Vui lòng thử lại.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Mã lớp *"
                value={classId}
                editable={false} // Không cho phép sửa mã lớp
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
                    onValueChange={(itemValue) => setClassType(itemValue)}
                >
                    <Picker.Item label="Lý thuyết" value="LT" />
                    <Picker.Item label="Thực hành" value="BT" />
                    <Picker.Item label="Lý thuyết + Thực hành" value="LT_BT" />
                </Picker>
            </View>
            <View style={styles.dropDownInput}>
                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                >
                    <Picker.Item label="Đang hoạt động" value="ACTIVE" />
                    <Picker.Item label="Hoàn thành" value="COMPLETED" />
                    <Picker.Item label="Sắp diễn ra" value="UPCOMING" />
                </Picker>
            </View>
            <View style={styles.rowView}>
                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setShowStartDatePicker(true)}
                >
                    <Text>Bắt đầu: {startDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(e, date) => handleDateChange(e, date, true)}
                    />
                )}
                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setShowEndDatePicker(true)}
                >
                    <Text>Kết thúc: {endDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(e, date) => handleDateChange(e, date, false)}
                    />
                )}
            </View>
            <TextInput
                style={styles.input}
                placeholder="Số lượng sinh viên tối đa *"
                value={maxStudent}
                onChangeText={setMaxStudent}
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleEditClass}>
                <Text style={styles.saveButtonText}>Cập nhật lớp học</Text>
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
        borderRadius: 8,
    },
    dropDownInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10,
        borderRadius: 8,
        height: 50,
        justifyContent: "center",
    },
    rowView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    saveButton: {
        backgroundColor: "#d32f2f",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default EditClass;
