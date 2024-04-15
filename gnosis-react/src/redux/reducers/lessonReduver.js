// src/redux/reducers/lessonReducer.js

import {
    FETCH_LESSONS_REQUEST,
    FETCH_LESSONS_SUCCESS,
    FETCH_LESSONS_FAILURE
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
        default:
            return state;
    }
};

export default lessonReducer;
