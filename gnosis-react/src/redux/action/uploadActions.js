import axios from 'axios';

import {
    UPLOAD_IMAGE_REQUEST,
    UPLOAD_IMAGE_SUCCESS,
    UPLOAD_IMAGE_FAILURE,
    UPLOAD_VIDEO_REQUEST,
    UPLOAD_VIDEO_SUCCESS,
    UPLOAD_VIDEO_FAILURE,
    UPLOAD_VIDEO_PROGRESS,
    FETCH_VIDEO_REQUEST,
    FETCH_VIDEO_SUCCESS,
    FETCH_VIDEO_FAILURE
} from '../types/uploadtypes';
export const uploadImage = (fileData) => {
    return async (dispatch) => {
        dispatch({ type: UPLOAD_IMAGE_REQUEST });
        try {
            const formData = new FormData();
            formData.append('image', fileData);
            const response = await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("Response data:", response.data);  // Kiểm tra dữ liệu trả về từ server

            if (response.data && response.data.url) {
                dispatch({
                    type: UPLOAD_IMAGE_SUCCESS,
                    payload: response.data.url
                });
                return response.data.url;  // Đảm bảo trả về URL
            } else {
                throw new Error("No URL returned from server");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            dispatch({
                type: UPLOAD_IMAGE_FAILURE,
                payload: error.response ? error.response.data : error.message
            });
        }
    };
};
export const uploadVideo = (fileData) => async (dispatch) => {
    dispatch({ type: UPLOAD_VIDEO_REQUEST });
    try {
        const formData = new FormData();
        formData.append('video', fileData);
        const response = await axios.post('http://localhost:3000/upload/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                dispatch({
                    type: UPLOAD_VIDEO_PROGRESS,
                    payload: percentCompleted
                });
            }
        });

        console.log("Response data:", response.data); // Kiểm tra dữ liệu trả về từ server

        if (response.data && response.data.url) {
            dispatch({
                type: UPLOAD_VIDEO_SUCCESS,
                payload: response.data.url
            });
            return response.data.url; // Đảm bảo trả về URL
        } else {
            throw new Error("No URL returned from server");
        }
    } catch (error) {
        console.error("Error uploading video:", error);
        dispatch({
            type: UPLOAD_VIDEO_FAILURE,
            payload: error.response ? error.response.data : error.message
        });
    }
};

export const fetchVideoUrl = (lessonId) => {
    return async (dispatch) => {
        dispatch({ type: FETCH_VIDEO_REQUEST });
        try {
            const response = await axios.get(`http://localhost:3000/v1/lesson/${lessonId}/videoUrl`); // Replace with your actual API endpoint
            if (response.data && response.data.url) {
                dispatch({
                    type: FETCH_VIDEO_SUCCESS,
                    payload: response.data.url
                });
            } else {
                throw new Error("No URL returned from server");
            }
        } catch (error) {
            console.error("Error fetching video URL:", error);
            dispatch({
                type: FETCH_VIDEO_FAILURE,
                payload: error.response ? error.response.data : error.message
            });
        }
    };
};