import React, { useState } from 'react';
import { View, Button, Platform, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const App = () => {
  const [date, setDate] = useState(new Date()); // Lưu giá trị ngày/giờ được chọn
  const [mode, setMode] = useState('date'); // Chế độ: "date" hoặc "time"
  const [show, setShow] = useState(false); // Hiển thị picker hay không
  const [selectedDate, setSelectedDate] = useState(''); // Ngày đã chọn
  const [selectedTime, setSelectedTime] = useState(''); // Giờ đã chọn

  const onChange = (event, selectedValue) => {
    setShow(false); // Ẩn picker sau khi chọn
    if (selectedValue) {
      const currentDate = selectedValue;
      setDate(currentDate);

      if (mode === 'date') {
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        setSelectedDate(formattedDate);
      } else if (mode === 'time') {
        const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
        setSelectedTime(formattedTime);
      }
    }
  };

  const showMode = (currentMode) => {
    setMode(currentMode); // Đặt chế độ: chọn ngày hoặc giờ
    setShow(true); // Hiển thị picker
  };

  return (
    <View style={styles.container}>
      {/* Nút chọn ngày */}
      <Button title="Chọn ngày" onPress={() => showMode('date')} />
      {/* Nút chọn giờ */}
      <Button title="Chọn giờ" onPress={() => showMode('time')} style={styles.button} />

      {/* Hiển thị kết quả */}
      <Text style={styles.text}>Ngày đã chọn: {selectedDate}</Text>
      <Text style={styles.text}>Giờ đã chọn: {selectedTime}</Text>

      {/* Hiển thị DateTimePicker */}
      {show && (
        <DateTimePicker
          value={date} // Ngày/giờ mặc định
          mode={mode} // Chế độ hiện tại (date/time)
          is24Hour={true} // Sử dụng giờ 24h
          display="default" // Giao diện mặc định
          onChange={onChange} // Xử lý khi chọn
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
  },
});

export default App;
