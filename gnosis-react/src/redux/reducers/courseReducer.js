// courseReducer.js
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

const initialState = {
    courses: [],
    loading: true,
    error: null
};

const initialCourseState = {
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
        case FETCH_COURSE_DETAIL:
            return { ...state, loading: true };
        case FETCH_COURSE_DETAIL_SUCCESS:
            return { ...state, loading: false, courseDetail: action.payload };
        case FETCH_COURSE_DETAIL_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case UPDATE_COURSE:
            return { ...state, courseDetail: { ...state.courseDetail, ...action.payload }, loading: false };
        case UPDATE_COURSE_FAILURE:
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
        case FETCH_USER_COURSES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_USER_COURSES_SUCCESS:
            return {
                ...state,
                userCourses: action.payload,
                loading: false,
                error: null
            };
        case FETCH_USER_COURSES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case APPROVE_COURSE_SUCCESS:
            return {
                ...state,
                courses: state.courses.map(course =>
                    course._id === action.payload._id ? action.payload : course
                ),
            };
        default:
            return state;
    }
};

export const coursePushReducer = (state = initialCourseState, action) => {
    switch (action.type) {
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
