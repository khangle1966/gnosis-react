import {
    ADD_TO_FAVORITE_REQUEST,
    ADD_TO_FAVORITE_SUCCESS,
    ADD_TO_FAVORITE_FAILURE,
    REMOVE_FROM_FAVORITE_REQUEST,
    REMOVE_FROM_FAVORITE_SUCCESS,
    REMOVE_FROM_FAVORITE_FAILURE,
    FETCH_FAVORITES_REQUEST,
    FETCH_FAVORITES_SUCCESS,
    FETCH_FAVORITES_FAILURE,
} from '../types/favoriteTypes';
import axios from 'axios';

// Thêm khóa học vào danh sách yêu thích
export const addToFavorite = (userId, courseId) => async dispatch => {
    dispatch({ type: ADD_TO_FAVORITE_REQUEST });
    try {
        const response = await axios.patch(`http://localhost:3000/favorites/${userId}/add/${courseId}`);
        dispatch({
            type: ADD_TO_FAVORITE_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: ADD_TO_FAVORITE_FAILURE,
            payload: error.message,
        });
    }
};

// Xóa khóa học khỏi danh sách yêu thích
export const removeFromFavorite = (userId, courseId) => async dispatch => {
    dispatch({ type: REMOVE_FROM_FAVORITE_REQUEST });
    try {
        const response = await axios.patch(`http://localhost:3000/favorites/${userId}/remove/${courseId}`);
        dispatch({
            type: REMOVE_FROM_FAVORITE_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: REMOVE_FROM_FAVORITE_FAILURE,
            payload: error.message,
        });
    }
};

// Lấy danh sách khóa học yêu thích của người dùng
export const fetchFavorites = (userId) => async dispatch => {
    dispatch({ type: FETCH_FAVORITES_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/favorites/${userId}`);
        dispatch({
            type: FETCH_FAVORITES_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_FAVORITES_FAILURE,
            payload: error.message,
        });
    }
};
