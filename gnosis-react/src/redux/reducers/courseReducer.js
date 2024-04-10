// Trong file reducers/courseReducer.js
const initialState = {
    courses: [],
    loading: true,
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
