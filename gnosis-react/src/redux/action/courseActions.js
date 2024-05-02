// Trong file actions/courseActions.js
import axios from 'axios';

import {
    UPDATE_COURSE,
    RESET_COURSE,
    SUBMIT_COURSE,
    SUBMIT_COURSE_SUCCESS,
    SUBMIT_COURSE_FAILURE,
    // src/redux/types.js

FETCH_USER_COURSES_REQUEST ,
FETCH_USER_COURSES_SUCCESS ,
FETCH_USER_COURSES_FAILURE

} from '../types/courseType';

export const fetchCourses = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:3000/v1/course');
        dispatch({
            type: 'FETCH_COURSES_SUCCESS',
            payload: response.data
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        dispatch({
            type: 'FETCH_COURSES_FAILURE',
            payload: error
        });
    }
};
export const fetchUserCourses = (courseIds) => async (dispatch) => {
    dispatch({ type: FETCH_USER_COURSES_REQUEST });
    try {
        const { data } = await axios.post('http://localhost:3000/v1/course/userCourses', { courseIds });
        dispatch({ type: FETCH_USER_COURSES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: FETCH_USER_COURSES_FAILURE,
            payload: error.response && error.response.data.message 
                     ? error.response.data.message 
                     : error.message
        });
    }
};

export const fetchCourseDetail = (courseId) => async (dispatch) => {
    try {
        dispatch({ type: 'FETCH_COURSE_DETAIL_REQUEST' });
        const response = await axios.get(`http://localhost:3000/v1/course/${courseId}`);
        console.log('API Response:', response.data);  // Log response data

        dispatch({
            type: 'FETCH_COURSE_DETAIL_SUCCESS',
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: 'FETCH_COURSE_DETAIL_FAILURE',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};
export function updateCourse(courseData) {
    return { type: UPDATE_COURSE, payload: courseData };
}
export const updateCourseDetails = (courseData) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:3000/v1/course/${courseData._id}`, courseData);
        dispatch({
            type: UPDATE_COURSE,
            payload: response.data
        });
    } catch (error) {
        console.error("Error updating course:", error);
        dispatch({
            type: 'UPDATE_COURSE_FAILURE',
            payload: error.response ? error.response.data.message : error.message
        });
    }
};

export function resetCourse() {
    return { type: RESET_COURSE };
}

export function submitCourse(courseData) {
    return async (dispatch) => {
        dispatch({ type: SUBMIT_COURSE });
        try {
            // Making API call to submit course data using Axios
            const response = await axios.post('http://localhost:3000/v1/course', courseData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Handling the response data
            const data = response.data;
            dispatch({ type: SUBMIT_COURSE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: SUBMIT_COURSE_FAILURE, payload: error.response ? error.response.data : error.message });
        }
    };
}