// Trong file actions/courseActions.js
import axios from 'axios';

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