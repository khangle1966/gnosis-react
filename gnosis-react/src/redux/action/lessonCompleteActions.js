import axios from 'axios';
import {
    COMPLETE_LESSON_REQUEST,
    COMPLETE_LESSON_SUCCESS,
    COMPLETE_LESSON_FAILURE,
    FETCH_LESSON_COMPLETE_REQUEST,
    FETCH_LESSON_COMPLETE_SUCCESS,
    FETCH_LESSON_COMPLETE_FAILURE
} from '../types/lessonCompleteTypes';

export const completeLesson = (lessonId, userId) => async (dispatch) => {
    dispatch({ type: COMPLETE_LESSON_REQUEST });
    try {
        const response = await axios.post(`http://localhost:3000/lesson-completion/complete`, { lessonId, userId });
        dispatch({ type: COMPLETE_LESSON_SUCCESS, payload: lessonId });
    } catch (error) {
        dispatch({ type: COMPLETE_LESSON_FAILURE, payload: error.message });
    }
};

export const fetchLessonComplete = (userId) => async (dispatch) => {
    dispatch({ type: FETCH_LESSON_COMPLETE_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/lesson-completion/user/${userId}`);
        dispatch({ type: FETCH_LESSON_COMPLETE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_LESSON_COMPLETE_FAILURE, payload: error.message });
    }
};