// Trong profileActions.js
import axios from 'axios';
import {

    PROFILE_CREATE_REQUEST,
    PROFILE_CREATE_SUCCESS,
    PROFILE_CREATE_FAILURE,
    PROFILE_UPDATE_REQUEST,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_UPDATE_FAILURE,
    // PROFILE_DELETE_REQUEST,
    // PROFILE_DELETE_SUCCESS,
    // PROFILE_DELETE_FAILURE,
    // PROFILE_CHECK_DUPLICATE_REQUEST,
    // PROFILE_CHECK_DUPLICATE_SUCCESS,
    // PROFILE_CHECK_DUPLICATE_FAILURE,
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


export const updateProfile = (profileData, userId) => async (dispatch) => {
    dispatch({ type: PROFILE_UPDATE_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/profile/${userId}`, profileData);
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