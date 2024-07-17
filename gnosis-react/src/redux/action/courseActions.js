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
    APPROVE_COURSE_SUCCESS,
    FETCH_COURSES_BY_AUTHOR_REQUEST,
    FETCH_COURSES_BY_AUTHOR_SUCCESS,
    FETCH_COURSES_BY_AUTHOR_FAILURE,
} from '../types/courseType';

// Hàm hành động để lấy tất cả các khóa học
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

// Hàm hành động để lấy các khóa học của một tác giả cụ thể
export const fetchCoursesByAuthor = (authorId) => async (dispatch) => {
    dispatch({ type: FETCH_COURSES_BY_AUTHOR_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/v1/course/author/${authorId}`);
        dispatch({
            type: FETCH_COURSES_BY_AUTHOR_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: FETCH_COURSES_BY_AUTHOR_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
};

// Hàm hành động để lấy các khóa học của người dùng
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

// Hàm hành động để lấy chi tiết một khóa học
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

// Hàm hành động để cập nhật xếp hạng của một khóa học
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

// Hàm hành động để cập nhật một khóa học
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

// Hàm hành động để cập nhật chi tiết khóa học
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

// Hàm hành động để đặt lại trạng thái khóa học
export function resetCourse() {
    return { type: RESET_COURSE };
}

// Hàm hành động để nộp khóa học
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

// Hàm hành động để phê duyệt một khóa học
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

// Hàm hành động để xóa một khóa học
export const deleteCourse = (courseId) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:3000/v1/course/${courseId}`);
        dispatch(fetchCourses()); // Fetch lại danh sách courses sau khi xóa
    } catch (error) {
        console.error('Failed to delete course:', error);
    }
};
