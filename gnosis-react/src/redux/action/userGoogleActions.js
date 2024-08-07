// src/redux/actions/userGoogleActions.js
import {
    FETCH_USERGOOGLE_REQUEST,
    FETCH_USERGOOGLE_SUCCESS,
    FETCH_USERGOOGLE_FAILURE,
    BAN_USERGOOGLE_REQUEST,
    BAN_USERGOOGLE_SUCCESS,
    BAN_USERGOOGLE_FAILURE,
    UNBAN_USERGOOGLE_REQUEST,
    UNBAN_USERGOOGLE_SUCCESS,
    UNBAN_USERGOOGLE_FAILURE,
    UPDATE_USERGOOGLE_REQUEST,
    UPDATE_USERGOOGLE_SUCCESS,
    UPDATE_USERGOOGLE_FAILURE,
    UPDATE_USERGOOGLE_PICURL_REQUEST,
    UPDATE_USERGOOGLE_PICURL_SUCCESS,
    UPDATE_USERGOOGLE_PICURL_FAILURE,
} from '../types/userGoogleTypes';
import axios from 'axios';

// Lấy danh sách người dùng Google
export const fetchUserGoogle = () => async (dispatch) => {
    dispatch({ type: FETCH_USERGOOGLE_REQUEST });
    try {
        const response = await axios.get('http://localhost:3000/v1/usergoogle');
        dispatch({ type: FETCH_USERGOOGLE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_USERGOOGLE_FAILURE, payload: error.message });
    }
};

// Lấy người dùng Google theo ID
export const fetchUserGoogleById = (id) => async (dispatch) => {
    dispatch({ type: FETCH_USERGOOGLE_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/v1/usergoogle/${id}`);
        dispatch({ type: FETCH_USERGOOGLE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_USERGOOGLE_FAILURE, payload: error.message });
    }
};

// Cấm người dùng Google
export const banUserGoogle = (id) => async (dispatch) => {
    dispatch({ type: BAN_USERGOOGLE_REQUEST });
    try {
        const { data } = await axios.put(`http://localhost:3000/v1/usergoogle/ban/${id}`);
        dispatch({ type: BAN_USERGOOGLE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: BAN_USERGOOGLE_FAILURE, payload: error.message });
    }
};

// Hủy cấm người dùng Google
export const unbanUserGoogle = (id) => async (dispatch) => {
    dispatch({ type: UNBAN_USERGOOGLE_REQUEST });
    try {
        const { data } = await axios.put(`http://localhost:3000/v1/usergoogle/unban/${id}`);
        dispatch({ type: UNBAN_USERGOOGLE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UNBAN_USERGOOGLE_FAILURE, payload: error.message });
    }
};

// Cập nhật thông tin người dùng Google
export const updateUserGoogle = (id, updateUserDto) => async (dispatch) => {
    dispatch({ type: UPDATE_USERGOOGLE_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/usergoogle/${id}`, updateUserDto);
        dispatch({ type: UPDATE_USERGOOGLE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: UPDATE_USERGOOGLE_FAILURE, payload: error.message });
    }
};

// Cập nhật URL ảnh đại diện người dùng Google
export const updateUserGooglePicUrl = (id, picUrl) => async (dispatch, getState) => {
    dispatch({ type: UPDATE_USERGOOGLE_PICURL_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/usergoogle/update-picurl/${id}`, { picUrl });
        dispatch({ type: UPDATE_USERGOOGLE_PICURL_SUCCESS, payload: response.data });
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

// Tải lên ảnh đại diện người dùng Google
export const uploadAvatar = (file, userId) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        const { data } = await axios.post('http://localhost:3000/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        await dispatch(updateUserGooglePicUrl(userId, data.url));
    } catch (error) {
        dispatch({
            type: UPDATE_USERGOOGLE_PICURL_FAILURE,
            payload: error.response?.data.message || error.message
        });
    }
};
