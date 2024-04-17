// src/redux/actions/chapterActions.js

import axios from 'axios';
import {
    FETCH_CHAPTERS_REQUEST,
    FETCH_CHAPTERS_SUCCESS,
    FETCH_CHAPTERS_FAILURE
} from '../types/chapterTypes';


export const setChapterId = (chapterId) => {
    return {
        type: 'SET_CHAPTER_ID',
        payload: chapterId,
    };
};
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
