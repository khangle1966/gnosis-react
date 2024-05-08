import axios from 'axios';
import {
    UPLOAD_IMAGE_REQUEST,
    UPLOAD_IMAGE_SUCCESS,
    UPLOAD_IMAGE_FAILURE
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

            if (response.data && response.data.url) {
                dispatch({
                    type: UPLOAD_IMAGE_SUCCESS,
                    payload: response.data.url
                });
                return response.data.url;  // Trả về URL
            } else {
                throw new Error("No URL returned from server");
            }
        } catch (error) {
            console.error('Error in uploadImage action:', error);
            dispatch({
                type: UPLOAD_IMAGE_FAILURE,
                payload: error.response ? error.response.data : error.message
            });
            return null;  // Trả về null nếu có lỗi
        }
    };
};


