// Trong profileActions.js
import axios from 'axios';
import {
    PROFILE_CREATE_REQUEST,
    PROFILE_CREATE_SUCCESS,
    PROFILE_CREATE_FAILURE,
    PROFILE_UPDATE_REQUEST,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_UPDATE_FAILURE,
    PROFILE_DELETE_REQUEST,
    PROFILE_DELETE_SUCCESS,
    PROFILE_DELETE_FAILURE
} from '../types/profileActionTypes';

export const createProfile = (profileData) => async (dispatch) => {
    dispatch({ type: PROFILE_CREATE_REQUEST });
    try {
        const response = await axios.post('http://localhost:3000/v1/profile', profileData);
        dispatch({ type: PROFILE_CREATE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: PROFILE_CREATE_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};