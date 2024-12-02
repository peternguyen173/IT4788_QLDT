
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../navigators/AuthProvider';
import axios from 'axios';


// data co the la
// id, title, desc, lecturer_id, deadline, file, class_id

// du lieu gui len server
//title, desc, 
// gui len server 
//file,token, assignment_id, textResponse

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    reason: Yup.string().required('Reason is required'),
    date: Yup.date().required('Date is required').nullable(),
    file: Yup.mixed().required('Proof file is required'),
});

const SubmitExam = ({ title, fileExam, desc }) => {

    console.log("title", title) 

    return (
        <Formik
            initialValues={{ title: '', reason: '', date: null, file: null }}
            validationSchema={validationSchema}
            // onSubmit={handleSubmitForm}
        >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (

                <View style={{ padding: 20 }}>
                    <Text style={{ marginBottom: 10 }}>Bạn cần điền đơn này đơn xin phép nghỉ học lớp học này </Text>
                    {/* Title Field */}
                    <Text>Title</Text>
                    <TextInput
                        placeholder="Enter the title"
                        // onChangeText={handleChange('title')}
                        // // aria-disabled
                        // onBlur={handleBlur('title')}
                        value="Bai tap cua ban"
                        style={{
                            marginBottom: 10, padding: 8, borderColor: 'gray',
                            borderRadius: 10, marginTop: 10, borderWidth: 1
                        }}
                    />
                    {touched.title && errors.title && <Text style={{ color: 'red' }}>{errors.title}</Text>}

                    {/* Reason Field */}
                    <Text>Mo ta cua giao vien</Text>
                    <TextInput
                        placeholder="Enter the reason"
                        // onChangeText={handleChange('reason')}
                        // onBlur={handleBlur('reason')}
                        value="mo ta cua giao vien"
                        style={{
                            marginBottom: 10, padding: 8, borderColor: 'gray',
                            borderRadius: 10, marginTop: 10, borderWidth: 1
                        }}
                    />
                    {touched.reason && errors.reason && <Text style={{ color: 'red' }}>{errors.reason}</Text>}

                    <Text>Mo ta cua cua ban</Text>
                    <TextInput
                        placeholder="Enter the reason"
                        // onChangeText={handleChange('reason')}
                        // onBlur={handleBlur('reason')}
                        value="mo ta cua giao vien"
                        style={{
                            marginBottom: 10, padding: 8, borderColor: 'gray',
                            borderRadius: 10, marginTop: 10, borderWidth: 1
                        }}
                    />
                    {/* {touched.reason && errors.reason && <Text style={{ color: 'red' }}>{errors.reason}</Text>} */}


                    {/* File Picker */}
                    <Text style={{ marginTop: 10 }}>Ảnh minh chứng</Text>
                    <View style={{ borderRadius: 20 }}>
                        <TouchableOpacity title="Select File"
                            // onPress={() => 
                            //         handleFileSelect(setFieldValue)}
                            color={'red'} 
                            style={{ borderRadius: 10, backgroundColor: 'red',
                                 padding: 10, alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'white', fontSize: 16 }} >Chon anh minh chung</Text>
                        </TouchableOpacity>
                    </View>
                    {/* {selectedFile && <Text style={{ marginTop: 5 }}>Selected File: {selectedFile.name || selectedFile.uri}</Text>}
                    {touched.file && errors.file && <Text style={{ color: 'red' }}>{errors.file}</Text>} */}




                    <TouchableOpacity title="Submit"
                        style={{ backgroundColor: 'red', padding: 10, alignItems: 'center', borderRadius: 10, marginTop: 20 }}
                        // onPress={handleSubmit}
                        >
                        <Text style={{ color: 'white', fontSize: 16 }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
    )
}



export default SubmitExam