

//type notification : ABSENCE, ACCEPT_ABSENCE_REQUEST, REJECT_ABSENCE_REQUEST, ASSIGNMENT_GRADE
//chắc không phải gửi ảnh

import axios from "axios";

export const sendNotification = async (token, message, toUser, type) => {
    const formData = new FormData();
    formData.append('token',token);
    formData.append('message', message);
    formData.append('toUser', toUser);
    formData.append('type', type);
    console.log("Form data:", formData);
    try {
        const response = await fetch("http://157.66.24.126:8080/it5023e/send_notification", {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        })
        // const response = await axios.post('http://157.66.24.126:8080/it5023e/send_notification', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // })
        console.log("Resonse", response);
        if (response.status === 200) {
            console.log('Send notification success');
        } else {
            console.log('Send notification failed');
        }
    } catch (error) {
        console.error(error);
        console.log('Send notification failed1', error.message);
    }
}