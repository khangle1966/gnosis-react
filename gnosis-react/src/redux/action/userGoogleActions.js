// userGoogleActions.js
import {
    FETCH_USERGOOGLE_REQUEST,
    FETCH_USERGOOGLE_SUCCESS,
    FETCH_USERGOOGLE_FAILURE,
    DELETE_USERGOOGLE_REQUEST,
    DELETE_USERGOOGLE_SUCCESS,
    DELETE_USERGOOGLE_FAILURE,
    UPDATE_USERGOOGLE_REQUEST,
    UPDATE_USERGOOGLE_SUCCESS,
    UPDATE_USERGOOGLE_FAILURE,
    UPDATE_USERGOOGLE_PICURL_REQUEST,
    UPDATE_USERGOOGLE_PICURL_SUCCESS,
    UPDATE_USERGOOGLE_PICURL_FAILURE,
} from '../types/userGoogleTypes';
import axios from 'axios';

export const fetchUserGoogle = () => async (dispatch) => {
    dispatch({ type: FETCH_USERGOOGLE_REQUEST });
    try {
        const response = await axios.get('http://localhost:3000/v1/usergoogle');
        dispatch({ type: FETCH_USERGOOGLE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_USERGOOGLE_FAILURE, payload: error.message });
    }
};

export const deleteUserGoogle = (id) => async (dispatch) => {
    dispatch({ type: DELETE_USERGOOGLE_REQUEST });
    try {
        await axios.delete(`http://localhost:3000/v1/usergoogle/${id}`);
        dispatch({ type: DELETE_USERGOOGLE_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: DELETE_USERGOOGLE_FAILURE, payload: error.message });
    }
};

export const updateUserGoogle = (id, updateUserDto) => async (dispatch) => {
    dispatch({ type: UPDATE_USERGOOGLE_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/usergoogle/${id}`, updateUserDto);
        dispatch({ type: UPDATE_USERGOOGLE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: UPDATE_USERGOOGLE_FAILURE, payload: error.message });
    }
};

export const updateUserGooglePicUrl = (id, picUrl) => async (dispatch, getState) => {
    dispatch({ type: UPDATE_USERGOOGLE_PICURL_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/usergoogle/update-picurl/${id}`, { picUrl });
        dispatch({ type: UPDATE_USERGOOGLE_PICURL_SUCCESS, payload: response.data });

        // Cập nhật user object trong Redux state
        const { auth } = getState();
        const updatedUser = {
            ...auth.user,
            picture: picUrl
        };
        dispatch({ type: 'AUTH_UPDATE_USER', payload: updatedUser });
    } catch (error) {
        dispatch({ type: UPDATE_USERGOOGLE_PICURL_FAILURE, payload: error.message });
    }
};

export const uploadAvatar = (file, userId) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const { data } = await axios.post('http://localhost:3000/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Sử dụng updateUserGooglePicUrl để cập nhật ảnh đại diện
        await dispatch(updateUserGooglePicUrl(userId, data.url));
    } catch (error) {
        dispatch({
            type: UPDATE_USERGOOGLE_PICURL_FAILURE,
            payload: error.response?.data.message || error.message
        });
    }
};
