import axios from 'axios';
import {
    FETCH_CHAPTERS_REQUEST,
    FETCH_CHAPTERS_SUCCESS,
    FETCH_CHAPTERS_FAILURE,
    ADD_CHAPTER_SUCCESS,
    REMOVE_CHAPTER_SUCCESS,
    UPDATE_CHAPTER_REQUEST,
    UPDATE_CHAPTER_SUCCESS,
    UPDATE_CHAPTER_FAILURE,
    UPDATE_CHAPTER_ORDER_REQUEST,
    UPDATE_CHAPTER_ORDER_SUCCESS,
    UPDATE_CHAPTER_ORDER_FAILURE,
} from '../types/chapterTypes';

// Hàm hành động để thêm một chương mới
export const addChapter = (newChapter) => async (dispatch) => {
    try {
        const response = await axios.post(`http://localhost:3000/v1/chapter`, newChapter);
        dispatch({ type: ADD_CHAPTER_SUCCESS, payload: response.data });
    } catch (error) {
        console.error('Add Chapter Failed:', error);
    }
};

// Hàm hành động để xóa một chương
export const removeChapter = (chapterId) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:3000/v1/chapter/${chapterId}`);
        dispatch({ type: REMOVE_CHAPTER_SUCCESS, payload: chapterId });
    } catch (error) {
        console.error('Remove Chapter Failed:', error);
    }
};

// Hàm hành động để thiết lập ID chương
export const setChapterId = (chapterId) => {
    return {
        type: 'SET_CHAPTER_ID',
        payload: chapterId,
    };
};

// Hàm hành động để lấy danh sách các chương dựa trên ID khóa học
export const fetchChaptersByCourseId = (courseId) => async (dispatch) => {
    dispatch({ type: FETCH_CHAPTERS_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/v1/chapter/course/${courseId}`);
        dispatch({ type: FETCH_CHAPTERS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: FETCH_CHAPTERS_FAILURE,
            payload: error.message
        });
    }
};

// Hàm hành động để cập nhật tiêu đề chương
export const updateChapterTitle = (chapterId, title) => async (dispatch) => {
    dispatch({ type: UPDATE_CHAPTER_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/chapter/${chapterId}`, { title });
        dispatch({
            type: UPDATE_CHAPTER_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_CHAPTER_FAILURE,
            payload: error.response ? error.response.data : "Unknown error"
        });
    }
};

// Hàm hành động để cập nhật thứ tự chương
export const updateChapterOrder = (chapters) => async (dispatch) => {
    dispatch({ type: UPDATE_CHAPTER_ORDER_REQUEST });
    try {
        const response = await axios.put(`http://localhost:3000/v1/chapter/chap/order`, { chapters });
        if (response.data && Array.isArray(response.data.chapters)) {
            dispatch({
                type: UPDATE_CHAPTER_ORDER_SUCCESS,
                payload: response.data
            });
        } else {
            throw new Error("Invalid data format");
        }
    } catch (error) {
        dispatch({
            type: UPDATE_CHAPTER_ORDER_FAILURE,
            payload: error.response ? error.response.data.message : "Unknown error"
        });
    }
};
