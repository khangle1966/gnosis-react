import axios from 'axios';
import {
    COMPLETE_LESSON_REQUEST,
    COMPLETE_LESSON_SUCCESS,
    COMPLETE_LESSON_FAILURE,
    FETCH_LESSON_COMPLETE_REQUEST,
    FETCH_LESSON_COMPLETE_SUCCESS,
    FETCH_LESSON_COMPLETE_FAILURE
} from '../types/lessonCompleteTypes';

// Hàm hành động để đánh dấu bài học là hoàn thành
export const completeLesson = (lessonId, userId, courseId) => async (dispatch) => {
    dispatch({ type: COMPLETE_LESSON_REQUEST });
    try {
        const response = await axios.post(`http://localhost:3000/lesson-completion/complete`, { lessonId, userId, courseId });
        dispatch({ type: COMPLETE_LESSON_SUCCESS, payload: { lessonId } });
        console.log(response);
    } catch (error) {
        dispatch({ type: COMPLETE_LESSON_FAILURE, payload: error.message });
    }
};

// Hàm hành động để lấy danh sách bài học hoàn thành của người dùng trong khóa học
export const fetchLessonComplete = (courseId, userId) => async (dispatch) => {
    dispatch({ type: FETCH_LESSON_COMPLETE_REQUEST });
    try {
        const response = await axios.get(`http://localhost:3000/lesson-completion/course/${courseId}/user/${userId}`);
        dispatch({ type: FETCH_LESSON_COMPLETE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_LESSON_COMPLETE_FAILURE, payload: error.message });
    }
};
