// src/redux/actions/lessonActions.js

import axios from 'axios';
import {
    FETCH_LESSONS_REQUEST,
    FETCH_LESSONS_SUCCESS,
    FETCH_LESSONS_FAILURE,
    ADD_LESSON_REQUEST,
    ADD_LESSON_SUCCESS,
    ADD_LESSON_FAILURE
} from '../types/lessonTypes';

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