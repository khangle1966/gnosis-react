// src/redux/reducers/lessonReducer.js

import {
    FETCH_LESSONS_REQUEST,
    FETCH_LESSONS_SUCCESS,
    FETCH_LESSONS_FAILURE,
    ADD_LESSON_REQUEST,
    ADD_LESSON_SUCCESS,
    ADD_LESSON_FAILURE,
    DELETE_LESSON_REQUEST,
    DELETE_LESSON_SUCCESS,
    DELETE_LESSON_FAILURE

} from '../types/lessonTypes';

const initialState = {
    loading: false,
    lessons: [],
    error: ''
};

const lessonReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_LESSONS_REQUEST:
            return { ...state, loading: true };
        case FETCH_LESSONS_SUCCESS:
            return { loading: false, lessons: action.payload, error: '' };
        case FETCH_LESSONS_FAILURE:
            return { loading: false, lessons: [], error: action.payload };
        case ADD_LESSON_REQUEST:
            return { ...state, loading: true };
        case ADD_LESSON_SUCCESS:
            return { ...state, loading: false, lessons: [...state.lessons, action.payload], error: '' };
        case ADD_LESSON_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case DELETE_LESSON_REQUEST:
            return { ...state, loading: true };
        case DELETE_LESSON_SUCCESS:
            return {
                ...state,
                lessons: state.lessons.filter(lesson => lesson._id !== action.payload),
                loading: false
            };
        case DELETE_LESSON_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default lessonReducer;
