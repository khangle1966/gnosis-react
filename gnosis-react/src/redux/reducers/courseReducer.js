// Trong file reducers/courseReducer.js
import { UPDATE_COURSE, RESET_COURSE, SUBMIT_COURSE, SUBMIT_COURSE_SUCCESS, SUBMIT_COURSE_FAILURE } from '../types/courseType';

const initialState = {
    courses: [],
    loading: true,
    error: null
}; const initialCourseState = {
    courseData: {
        type: "",
        name: "",
        category: "",
        description: "",
        language: "",
        pricing: "",
        coverImage: "",
        isReleased: false
    },
    loading: false,
    error: null
};
const courseDetailInitialState = {
    courseDetail: {},
    loading: false,
    error: null,
};
export const courseDetailReducer = (state = courseDetailInitialState, action) => {
    switch (action.type) {
        case 'FETCH_COURSE_DETAIL_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_COURSE_DETAIL_SUCCESS':
            return { ...state, loading: false, courseDetail: action.payload };
        case 'FETCH_COURSE_DETAIL_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
export const courseReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_COURSES_SUCCESS':
            return {
                ...state,
                courses: action.payload,
                loading: false,
                error: null
            };
        case 'FETCH_COURSES_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const coursePushReducer = (state = initialCourseState, action) => {
    switch (action.type) {
        case UPDATE_COURSE:
            return {
                ...state,
                courseData: { ...state.courseData, ...action.payload }
            };
        case RESET_COURSE:
            return initialCourseState;
        case SUBMIT_COURSE:
            return { ...state, loading: true };
        case SUBMIT_COURSE_SUCCESS:
            return { ...state, loading: false, courseData: action.payload };
        case SUBMIT_COURSE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};