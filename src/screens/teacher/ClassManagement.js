import React from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  FlatList,
} from "react-native";
import { useAuth } from "../../navigators/AuthProvider";

const ClassManagement =  ({ navigation }) => {
  const { userData } = useAuth();

  const classData = [
    {
      id: "IT4788",
      code: "IT4788",
      name: "Phát triển ứng dụng di động",
      learningCode: "IT4788",
      classType: "Lớp học",
      startDate: "2021-09-01",
      endDate: "2021-12-01",
      maxStudent: 50,
    },
    {
      id: "IT4789",
      code: "IT4789",
      name: "Phát triển ứng dụng web",
      learningCode: "IT4789",
      classType: "Lớp học",
      startDate: "2021-09-01",
      endDate: "2021-12-01",
      maxStudent: 50,
    },
    {
      id: "IT4790",
      code: "IT4790",
      name: "Phát triển ứng dụng di động",
      learningCode: "IT4790",
      classType: "Lớp học",
      startDate: "2021-09-01",
      endDate: "2021-12-01",
      maxStudent: 50,
    },
    {
      id: "IT4791",
      code: "IT4791",
      name: "Phát triển ứng dụng web",
      learningCode: "IT4791",
      classType: "Lớp học",
      startDate: "2021-09-01",
      endDate: "2021-12-01",
      maxStudent: 50,
    },
  ];

  const renderItem = ({ item }) => (
    <View style={[styles.row, styles.column]}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.code}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.learningCode}</Text>
      <Text style={styles.cell}>{item.classType}</Text>
      <Text style={styles.cell}>{item.startDate}</Text>
      <Text style={styles.cell}>{item.endDate}</Text>
      <Text style={styles.cell}>{item.maxStudent}</Text>
    </View>
  );
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>
        Mã lớp
      </Text>
      <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>
        Mã lớp kèm
      </Text>
      <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>
        Tên lớp
      </Text>
      <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>
        Mã học phần
      </Text>
      <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>
        Loại lớp
      </Text>
      <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>
        Ngày bắt đầu
      </Text>
      <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>
        Ngày kết thúc
      </Text>
      <Text style={[styles.cell, styles.headerCell, styles.borderRight]}>
        Số lượng tối đa
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.flexContainer}>
        <View style={styles.searchSection}>
          <TextInput style={styles.input} placeholder="Mã lớp" />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.buttonText}>Tìm kiếm</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal style={styles.scrollContainer}>
          <View>
            {renderHeader()}
            <FlatList
              // ListHeaderComponent={renderHeader}
              data={classData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.contentContainerStyle}
              style={styles.tableStyle}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('CreateClass')}>
            <Text style={styles.buttonText}>Tạo lớp học</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('EditClass')}>
            <Text style={styles.buttonText}>Chỉnh</Text>
          </TouchableOpacity>
        </View>
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
  column: {
    flex: 1,
    padding: 5,
  },
  scrollContainer: {
    borderWidth: 1,
    borderColor: "#d32f2f",
    maxHeight: 300,
  },
  searchSection: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d32f2f",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontStyle: "italic",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cell: {
    width: 100,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: "#fff",
  },
  bottomButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  bottomText: {
    color: "#d32f2f",
    fontStyle: "italic",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  tableStyle: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "#d32f2f",
    // marginTop: 16,
  },
  flexContainer: {
    flex: 1,
  },
});

export default ClassManagement;
