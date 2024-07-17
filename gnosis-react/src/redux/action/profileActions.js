// src/redux/actions/profileActions.js
import axios from 'axios';
import {
    PROFILE_CREATE_REQUEST,
    PROFILE_CREATE_SUCCESS,
    PROFILE_CREATE_FAILURE,
    PROFILE_UPDATE_REQUEST,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_UPDATE_FAILURE,
    PROFILE_FETCH_REQUEST,
    PROFILE_FETCH_SUCCESS,
    PROFILE_FETCH_FAILURE,
    PROFILE_STATS_FETCH_REQUEST,
    PROFILE_STATS_FETCH_SUCCESS,
    PROFILE_STATS_FETCH_FAILURE,
} from '../types/profileActionTypes';

// Kiểm tra yêu cầu hồ sơ trùng lặp
export const checkDuplicateProfileRequest = () => {
    return { type: 'CHECK_DUPLICATE_PROFILE_REQUEST' };
}

// Thành công khi kiểm tra hồ sơ trùng lặp
export const checkDuplicateProfileSuccess = (isDuplicate) => {
    return { type: 'CHECK_DUPLICATE_PROFILE_SUCCESS', payload: isDuplicate };
}

// Thất bại khi kiểm tra hồ sơ trùng lặp
export const checkDuplicateProfileFailure = (error) => {
    return { type: 'CHECK_DUPLICATE_PROFILE_FAILURE', payload: error };
}

// Lấy thông tin hồ sơ theo userId
export const fetchProfile = (userId) => async (dispatch) => {
    dispatch({ type: PROFILE_FETCH_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/v1/profile/by-id/${userId}`);
        console.log('Fetched profile data:', response.data);
        dispatch({ type: PROFILE_FETCH_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatch({
            type: PROFILE_FETCH_FAILURE,
            payload: error.response ? error.response.data.message : error.message
        });
    }
};

// Lấy thống kê hồ sơ theo userId
export const fetchProfileStats = (userId) => async (dispatch) => {
    dispatch({ type: PROFILE_STATS_FETCH_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/v1/profile/stats/${userId}`);
        console.log('Fetched profile stats:', response.data);
        dispatch({ type: PROFILE_STATS_FETCH_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: PROFILE_STATS_FETCH_FAILURE,
            payload: error.response ? error.response.data.message : error.message
        });
    }
};

// Hoàn thành khóa học cho userId
export const completeCourse = (userId, courseId) => async (dispatch, getState) => {
    dispatch({ type: PROFILE_UPDATE_REQUEST });
    try {
        console.log("Starting completeCourse action");
        const { profile } = getState().profile;

        // Kiểm tra và khởi tạo giá trị mặc định cho completedCourse
        const completedCourse = profile.completedCourse ? profile.completedCourse : [];
        const updatedCompletedCourses = [...completedCourse, courseId];

        const updatedProfileData = {
            ...profile,
            completedCourse: updatedCompletedCourses.map(id => String(id))
        };

        console.log("Updated profile data: ", updatedProfileData);

        const response = await axios.put(`http://localhost:3000/v1/profile/${userId}`, updatedProfileData);
        dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: response.data });
        console.log("Profile update success: ", response.data);
    } catch (error) {
        console.error("Profile update error: ", error);
        dispatch({
            type: PROFILE_UPDATE_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Cập nhật hồ sơ cho userId
export const updateProfile = (profileData, userId) => async (dispatch) => {
    dispatch({ type: PROFILE_UPDATE_REQUEST });

    try {
        // Đảm bảo tất cả ObjectIds đều được chuyển đổi thành chuỗi
        const sanitizedProfileData = {
            ...profileData,
            ongoingCourse: profileData.ongoingCourse.map(id => (typeof id === 'object' && id._id ? id._id.toString() : id.toString())),
            courses: profileData.courses.map(id => (typeof id === 'object' && id._id ? id._id.toString() : id.toString())),
            completedCourse: profileData.completedCourse.map(id => (typeof id === 'object' && id._id ? id._id.toString() : id.toString())),
        };

        const response = await axios.put(`http://localhost:3000/v1/profile/${userId}`, sanitizedProfileData);
        dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: PROFILE_UPDATE_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Cập nhật hồ sơ cho userId (cách 2)
export const updateProfile2 = (profileData, userId) => async (dispatch) => {
    dispatch({ type: PROFILE_UPDATE_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/profile/${userId}`, profileData);
        console.log(response);
        dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: PROFILE_UPDATE_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Tạo hồ sơ mới
export const createProfile = (profileData) => async (dispatch) => {
    dispatch({ type: PROFILE_CREATE_REQUEST });
    try {
        const response = await axios.post('http://localhost:3000/v1/profile', profileData);
        dispatch({ type: PROFILE_CREATE_SUCCESS, payload: response.data });
        console.log(response.data)
    } catch (error) {
        dispatch({
            type: PROFILE_CREATE_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Tạo hồ sơ cho người dùng Google
export const createProfileforUserGoogle = (profileData) => async (dispatch) => {
    dispatch({ type: PROFILE_CREATE_REQUEST });
    try {
        const response = await axios.post('http://localhost:3000/v1/profile/googleprofile', profileData);
        dispatch({ type: PROFILE_CREATE_SUCCESS, payload: response.data });
        console.log(response.data)
    } catch (error) {
        dispatch({
            type: PROFILE_CREATE_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Kiểm tra hồ sơ trùng lặp bằng email
export const checkDuplicateProfile = (email) => async (dispatch) => {
    try {
        dispatch(checkDuplicateProfileRequest());
        const response = await axios.get(`http://localhost:3000/v1/profile/${email}`);
        dispatch(checkDuplicateProfileSuccess(response.data.isDuplicate));
    } catch (error) {
        dispatch(checkDuplicateProfileFailure(error.message));
    }
}
