import axios from 'axios';
import {
    FETCH_LESSONS_REQUEST,
    FETCH_LESSONS_SUCCESS,
    FETCH_LESSONS_FAILURE,
    ADD_LESSON_REQUEST,
    ADD_LESSON_SUCCESS,
    ADD_LESSON_FAILURE,
    DELETE_LESSON_REQUEST,
    DELETE_LESSON_SUCCESS,
    DELETE_LESSON_FAILURE,
    FETCH_LESSONID_REQUEST,
    FETCH_LESSONID_SUCCESS,
    FETCH_LESSONID_FAILURE,
} from '../types/lessonTypes';

// Hàm hành động để lấy danh sách bài học theo ID khóa học
export const fetchLessonsByCourseId = (courseId) => async (dispatch) => {
    dispatch({ type: FETCH_LESSONS_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/v1/lesson/course/${courseId}`);
        dispatch({ type: FETCH_LESSONS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: FETCH_LESSONS_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Hàm hành động để lấy danh sách bài học theo ID chương
export const fetchLessonsBychapterId = (chapterId) => async (dispatch) => {
    dispatch({ type: FETCH_LESSONS_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/v1/lesson/chapter/${chapterId}`);
        dispatch({ type: FETCH_LESSONS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: FETCH_LESSONS_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Hàm hành động để thêm một bài học mới
export const addLesson = (lessonData) => async (dispatch) => {
    dispatch({ type: ADD_LESSON_REQUEST });
    try {
        const response = await axios.post(`http://localhost:3000/v1/lesson`, lessonData);
        dispatch({ type: ADD_LESSON_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: ADD_LESSON_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Hàm hành động để xóa một bài học
export const deleteLesson = (lessonId) => async (dispatch) => {
    dispatch({ type: DELETE_LESSON_REQUEST });
    try {
        await axios.delete(`http://localhost:3000/v1/lesson/${lessonId}`);
        dispatch({
            type: DELETE_LESSON_SUCCESS,
            payload: lessonId
        });
    } catch (error) {
        dispatch({
            type: DELETE_LESSON_FAILURE,
            payload: error.response ? error.response.data.message : "Unknown error"
        });
    }
};

// Hàm hành động để lấy chi tiết một bài học theo ID
export const fetchLessonById = (lessonId) => async (dispatch) => {
    dispatch({ type: FETCH_LESSONID_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/v1/lesson/${lessonId}`);
        dispatch({ type: FETCH_LESSONID_SUCCESS, payload: response.data });
        console.log("repossne", response.data)
    } catch (error) {
        dispatch({
            type: FETCH_LESSONID_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};
