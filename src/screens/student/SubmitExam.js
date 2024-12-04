
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Linking, Alert, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../navigators/AuthProvider';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';


// data co the la
// id, title, desc, lecturer_id, deadline, file, class_id

// du lieu gui len server
//title, desc, 
// gui len server 
//file,token, assignment_id, textResponse

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    // desLecturer: Yup.string().required('des is required'),
    desStudent: Yup.string().required('Des is required'),
    file: Yup.mixed().required('Proof file is required'),
});


const SubmitExam = ({ route }) => {
    console.log("Dữ liệu bài tập: ", route.params.survey)
    const { description, fileUrl, id, name, sendTime } = route.params.survey;
    console.log(description)
    const { userData } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);

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

    const handleOpenFileUrl = (url) => {
        if (url) {
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (supported) {
                        Linking.openURL(url);
                    } else {
                        Alert.alert('Không thể mở URL', 'URL không hợp lệ hoặc không được hỗ trợ.');
                    }
                })
                .catch((err) => console.error('Error opening URL:', err));
        } else {
            Alert.alert('Không có URL', 'Không có liên kết để mở.');
        }
    };

    const handleSubmitForm = async (values) => {
        const formData = new FormData();
        formData.append('token', userData.token);
        formData.append('assignmentId', id);
        formData.append('textResponse', values.desStudent);
        console.log('Form values:', values.file);
        if (values.file) {
            const file = values.file;  // Using the file from Formik's state
            formData.append('file', {
                uri: file.uri,  // Correct file URI
                type: file.mimeType || 'application/octet-stream', // File MIME type
                name: file.name || 'uploaded_file', // File name
            });
        }


        console.log('Form data:', formData);
        try {
            const response = await axios.post('http://157.66.24.126:8080/it5023e/submit_survey?file', formData,{
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
            alert(error.response ? `Lỗi: ${error.response.data.data}. Hành động: ${error.response.data.meta.message}` : 'Error submitting form');
        }




    }

    return (
        <Formik
            initialValues={{ title: '', desLecturer: '', desStudent: '', file: null }}
            validationSchema={validationSchema}
            onSubmit={handleSubmitForm}
        >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (

                <View style={{ padding: 20 }}>
                    <Text style={{ marginBottom: 10 }}>Đây là form để bạn nộp bài tập</Text>
                    {/* Title Field */}
                    <Text>Tiêu đề</Text>
                    <TextInput
                        placeholder="Enter the title"
                        onChangeText={handleChange('title')}
                        // value= {title}
                        onBlur={handleBlur('title')}
                        style={{
                            marginBottom: 10, padding: 8, borderColor: 'gray',
                            borderRadius: 10, marginTop: 10, borderWidth: 1
                        }}
                    />
                    {touched.title && errors.title && <Text style={{ color: 'red' }}>{errors.title}</Text>}


                    {description && <Text style={{ marginBottom: 5 }}>Mô tả của giáo viên: {description}</Text>}
                    {fileUrl && (
                        <TouchableOpacity onPress={() => handleOpenFileUrl(fileUrl)}>
                            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Tải file bài tập</Text>
                        </TouchableOpacity>
                    )}

                    {/* Reason Field */}
                    

                    <Text style={{marginTop:10}}>Mô tả của bạn</Text>
                    <TextInput
                        placeholder="Enter the reason"
                        onChangeText={handleChange('desStudent')}
                        onBlur={handleBlur('desStudent')}
                        // value="mo ta cua giao vien"
                        style={{
                            marginBottom: 10, padding: 8, borderColor: 'gray',
                            borderRadius: 10, marginTop: 0, borderWidth: 1
                        }}
                    />
                    {touched.desStudent && errors.desStudent && <Text style={{ color: 'red' }}>{errors.desStudent}</Text>}


                    {/* File Picker */}
                    <Text style={{ marginTop: 10 }}>File bài tập của bạn</Text>
                    <View style={{ borderRadius: 20 }}>
                        <TouchableOpacity title="Select File"
                            onPress={() =>
                                handleFileSelect(setFieldValue)}
                            color={'red'}
                            style={{
                                borderRadius: 10, backgroundColor: 'red',
                                padding: 10, alignItems: 'center', marginTop: 10
                            }}>
                            <Text style={{ color: 'white', fontSize: 16 }} >Chọn file</Text>
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
    )
}



export default SubmitExam