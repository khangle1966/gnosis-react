// Trong profileActions.js
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
    PROFILE_FETCH_FAILURE
} from '../types/profileActionTypes';
export const checkDuplicateProfileRequest = () => {
    return { type: 'CHECK_DUPLICATE_PROFILE_REQUEST' };
}

export const checkDuplicateProfileSuccess = (isDuplicate) => {
    return { type: 'CHECK_DUPLICATE_PROFILE_SUCCESS', payload: isDuplicate };
}

export const checkDuplicateProfileFailure = (error) => {
    return { type: 'CHECK_DUPLICATE_PROFILE_FAILURE', payload: error };
}

export const fetchProfile = (userId) => async (dispatch) => {
    dispatch({ type: PROFILE_FETCH_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/v1/profile/by-id/${userId}`);
        dispatch({ type: PROFILE_FETCH_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: PROFILE_FETCH_FAILURE,
            payload: error.response ? error.response.data.message : error.message
        });
    }
};

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


export const updateProfile = (profileData, userId) => async (dispatch) => {
    dispatch({ type: PROFILE_UPDATE_REQUEST });

    try {
        // Ensure that all ObjectIds are converted to strings
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

export const checkDuplicateProfile = (email) => async (dispatch) => {
    try {
        dispatch(checkDuplicateProfileRequest());
        const response = await axios.get(`http://localhost:3000/v1/profile/${email}`);
        dispatch(checkDuplicateProfileSuccess(response.data.isDuplicate));
    } catch (error) {
        dispatch(checkDuplicateProfileFailure(error.message));
    }
}