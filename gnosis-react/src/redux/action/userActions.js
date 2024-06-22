import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILURE,
    CREATE_USER_REQUEST,
    CREATE_USER_SUCCESS,
    CREATE_USER_FAILURE,
    BAN_USER_REQUEST,
    BAN_USER_SUCCESS,
    BAN_USER_FAILURE,
    UNBAN_USER_REQUEST,
    UNBAN_USER_SUCCESS,
    UNBAN_USER_FAILURE,
} from '../types/userTypes';
import axios from 'axios';

export const fetchUsers = () => async (dispatch) => {
    dispatch({ type: FETCH_USERS_REQUEST });
    try {
        const response = await axios.get('http://localhost:3000/v1/user');
        dispatch({ type: FETCH_USERS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
    }
};

export const updateUser = (id, user) => async (dispatch) => {
    dispatch({ type: UPDATE_USER_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/user/${id}`, user);
        dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
    }
};

export const deleteUser = (id) => async (dispatch) => {
    dispatch({ type: DELETE_USER_REQUEST });
    try {
        await axios.delete(`http://localhost:3000/v1/user/uid/${id}`);
        dispatch({ type: DELETE_USER_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: DELETE_USER_FAILURE, payload: error.message });
    }
};

export const createUser = (userData) => async (dispatch) => {
    dispatch({ type: CREATE_USER_REQUEST });
    try {
        const response = await axios.post('http://localhost:3000/v1/user', userData);
        dispatch({ type: CREATE_USER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: CREATE_USER_FAILURE, payload: error.message });
    }
};

export const banUser = (uid) => async (dispatch) => {
    dispatch({ type: BAN_USER_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/user/ban/${uid}`);
        dispatch({ type: BAN_USER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: BAN_USER_FAILURE, payload: error.message });
    }
};

export const unbanUser = (uid) => async (dispatch) => {
    dispatch({ type: UNBAN_USER_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/user/unban/${uid}`);
        dispatch({ type: UNBAN_USER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: UNBAN_USER_FAILURE, payload: error.message });
    }
};
