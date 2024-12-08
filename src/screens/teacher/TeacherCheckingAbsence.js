import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../navigators/AuthProvider";
import { sendNotification } from "../../utils/sendNotification";

const TeacherCheckingAbsence = ({ route }) => {
  const { classId,className } = route.params;
  console.log(className)
  const { userData } = useAuth();
  const [listAbsence, setListAbsence] = useState([]);
  
  // Fetch danh sách đơn xin nghỉ
  const fetchListAbsence = async () => {
    try {
      const response = await fetch("http://157.66.24.126:8080/it5023e/get_absence_requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userData.token,
          class_id: classId,
          status: null,
          pageable_request: {
            page: 0,
            page_size: 5,
          },
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        setListAbsence(data.data.page_content);
        console.log(data.data.page_content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Xử lý thay đổi trạng thái
  const handleChangeStatus = async (id, newStatus,toUser) => {
    try {
      const response = await fetch(`http://157.66.24.126:8080/it5023e/review_absence_request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userData.token,
          request_id: id,
          status: newStatus,
        }),
      });

      if (response.status === 200) {
        Alert.alert("Thành công", `Trạng thái đã được cập nhật thành ${newStatus}`);
        if(newStatus === "ACCEPTED"){
          await sendNotification(userData.token,`Đơn xin nghỉ học lớp ${className} đã được cập nhật`,toUser, "ACCEPT_ABSENCE_REQUEST");
        }else {
          await sendNotification(userData.token,`Đơn xin nghỉ học lớp ${className} đã được cập nhật`,toUser, "REJECT_ABSENCE_REQUEST");
        }
        fetchListAbsence(); // Cập nhật lại danh sách
      } else {
        Alert.alert("Thất bại", "Không thể cập nhật trạng thái");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchListAbsence();
  }, [classId]);

  // Hiển thị từng item
  const renderAbsenceItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>Học sinh: {item.student_account.first_name} {item.student_account.last_name}</Text>
      <Text>Ngày nghỉ: {item.absence_date}</Text>
      <Text>Lý do: {item.reason}</Text>
      <Text>Trạng thái: {item.status}</Text>
      <View style={styles.buttonContainer}>
        {item.status === "PENDING" && (
          <>
            <Button title="Chấp nhận" onPress={() => handleChangeStatus(item.id, "ACCEPTED",item.student_account.account_id)} />
            <Button title="Từ chối" color="red" onPress={() => handleChangeStatus(item.id, "REJECTED",item.student_account.account_id)} />
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={listAbsence}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAbsenceItem}
      />
      <Text onPress={async ()=> await sendNotification(userData.token,"Moi nhat","341","ACCEPT_ABSENCE_REQUEST")}></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default TeacherCheckingAbsence;
