// courseActions.js
import axios from 'axios';
import {
    UPDATE_COURSE,
    RESET_COURSE,
    SUBMIT_COURSE,
    SUBMIT_COURSE_SUCCESS,
    SUBMIT_COURSE_FAILURE,
    FETCH_USER_COURSES_REQUEST,
    FETCH_USER_COURSES_SUCCESS,
    FETCH_USER_COURSES_FAILURE,
    FETCH_COURSE_DETAIL,
    FETCH_COURSE_DETAIL_SUCCESS,
    FETCH_COURSE_DETAIL_FAILURE,
    UPDATE_COURSE_FAILURE,
    APPROVE_COURSE_SUCCESS
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
        dispatch({ type: FETCH_COURSE_DETAIL });
        const response = await axios.get(`http://localhost:3000/v1/course/${courseId}`);
        dispatch({
            type: FETCH_COURSE_DETAIL_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: FETCH_COURSE_DETAIL_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const updateCourseRating = (courseId, rating) => async (dispatch) => {
    try {
        const response = await axios.patch(`http://localhost:3000/v1/course/${courseId}/rating`, { rating });
        dispatch({
            type: UPDATE_COURSE,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_COURSE_FAILURE,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};

export const updateCourse = (courseId, updates) => async (dispatch) => {
    try {
        const response = await axios.patch(`http://localhost:3000/v1/course/${courseId}`, updates);
        dispatch({
            type: UPDATE_COURSE,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: FETCH_COURSE_DETAIL_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};
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
            const response = await axios.post('http://localhost:3000/v1/course', courseData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            dispatch({ type: SUBMIT_COURSE_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: SUBMIT_COURSE_FAILURE, payload: error.response ? error.response.data : error.message });
        }
    };
}
export const approveCourse = (courseId) => async (dispatch) => {
    try {
      const response = await axios.put(`http://localhost:3000/v1/course/${courseId}/approve`);
      dispatch({
        type: APPROVE_COURSE_SUCCESS,
        payload: response.data,
      });
      dispatch(fetchCourses()); // Fetch lại danh sách courses sau khi duyệt
    } catch (error) {
      console.error('Failed to approve course:', error);
    }
  };

  export const deleteCourse = (courseId) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:3000/v1/course/${courseId}`);
        dispatch(fetchCourses()); // Fetch lại danh sách courses sau khi xóa
    } catch (error) {
        console.error('Failed to delete course:', error);
    }
};