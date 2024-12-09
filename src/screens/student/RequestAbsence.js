import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../navigators/AuthProvider';
import axios from 'axios';
// Validation schema using Yup
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  reason: Yup.string().required('Reason is required'),
  date: Yup.date().required('Date is required').nullable(),
  file: Yup.mixed().required('Proof file is required'),
});

const RequestAbsence = ({ navigation,route }) => {
  console.log(route.params)
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { userData } = useAuth();
  console.log('User data:', userData);
  console.log('Token:', userData.token);
  const handleFileSelect = async (setFieldValue) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // All file types
      });
      console.log('Document picked:', result);

      if (!result.canceled) {
        const selectedAsset = result.assets[0];  // Accessing the first asset
        setSelectedFile(selectedAsset);
        setFieldValue('file', selectedAsset);  // Set file for Formik

        console.log('Selected file:', selectedAsset);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };



  const handleDateChange = (event, selectedDate, setFieldValue) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFieldValue('date', selectedDate);
    }
  };

  const handleSubmitForm = async (values) => {
    const formData = new FormData();
    formData.append('token', userData.token);
    formData.append('classId', route.params.classId);
    formData.append('date', formatDate(values.date));
    formData.append('reason', values.reason);

    // Checking if a file was selected
    if (values.file) {
      const file = values.file;  // Using the file from Formik's state
      formData.append('file', {
        uri: file.uri,  // Correct file URI
        type: file.mimeType || 'application/octet-stream', // File MIME type
        name: file.name || 'uploaded_file', // File name
      });
    }
    formData.append('title', values.title);

    console.log('Form data:', formData);

    try {
      const response = await axios.post('http://157.66.24.126:8080/it5023e/request_absence', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Automatically handled by axios
        },
      });

      console.log('Response:', response);

      if (response.status === 200) {
        console.log('Form submitted successfully');
        alert('Form submitted successfully');
      } else {
        console.error('Form submission failed');
        alert('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message : 'Error submitting form');
    }

  }

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  return (
    <>


      <Formik
        initialValues={{ title: '', reason: '', date: null, file: null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (

          <View style={{ padding: 20 }}>
            <Text style={{ marginBottom: 10 }}>Bạn cần điền đơn này đơn xin phép nghỉ học lớp học này </Text>
            {/* Title Field */}
            <Text style={{marginBottom:10}}>Bạn đang xin nghi cho lớp {route.params.className} với mã lớp {route.params.classId}</Text>
            <Text>Title</Text>
            <TextInput
              placeholder="Enter the title"
              onChangeText={handleChange('title')}
              // aria-disabled
              onBlur={handleBlur('title')}

              value={values.title}
              style={{
                marginBottom: 10, padding: 8, borderColor: 'gray',
                borderRadius: 10, marginTop: 10, borderWidth: 1
              }}
            />
            {touched.title && errors.title && <Text style={{ color: 'red' }}>{errors.title}</Text>}

            {/* Reason Field */}
            <Text>Reason</Text>
            <TextInput
              placeholder="Enter the reason"
              onChangeText={handleChange('reason')}
              onBlur={handleBlur('reason')}
              value={values.reason}
              multiline
              style={{
                borderWidth: 1, marginBottom: 10, marginTop: 10,
                padding: 8, height: 100, borderColor: 'gray', borderRadius: 10

              }}
            />
            {touched.reason && errors.reason && <Text style={{ color: 'red' }}>{errors.reason}</Text>}

            {/* Date Field */}
            <Text>Ngày Nghỉ</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ borderWidth: 1, padding: 8, marginBottom: 10, borderColor: 'grey', borderRadius: 10, marginTop: 10 }}>
              <Text>{values.date ? formatDate(values.date) : 'Select date'}</Text>
            </TouchableOpacity>
            {touched.date && errors.date && <Text style={{ color: 'red' }}>{errors.date}</Text>}

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, setFieldValue)}
              />
            )}

            {/* File Picker */}
            <Text style={{ marginTop: 10 }}>Ảnh minh chứng</Text>
            <View style={{ borderRadius: 20 }}>
              <TouchableOpacity title="Select File"
                onPress={() => handleFileSelect(setFieldValue)} color={'red'} style={{ borderRadius: 10, backgroundColor: 'red', padding: 10, alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: 'white', fontSize: 16 }} >Chọn ảnh minh chứng</Text>
              </TouchableOpacity>
            </View>
            {selectedFile && <Text style={{ marginTop: 5 }}>Selected File: {selectedFile.name || selectedFile.uri}</Text>}
            {touched.file && errors.file && <Text style={{ color: 'red' }}>{errors.file}</Text>}




            <TouchableOpacity title="Submit"
              style={{ backgroundColor: 'red', padding: 10, alignItems: 'center', borderRadius: 10, marginTop: 20 }}
              onPress={handleSubmit}>
              <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <TouchableOpacity
        onPress={() => navigation.navigate('HistoryReqAbsence', { classId: route.params.classId })}
      >
        <Text style={{padding:20, }}>Xem danh sách xin nghỉ học của bạn </Text>
      </TouchableOpacity>
    </>
  );
};

export default RequestAbsence;
