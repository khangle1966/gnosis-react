import {
    COMPLETE_LESSON_REQUEST,
    COMPLETE_LESSON_SUCCESS,
    COMPLETE_LESSON_FAILURE,
    FETCH_LESSON_COMPLETE_REQUEST,
    FETCH_LESSON_COMPLETE_SUCCESS,
    FETCH_LESSON_COMPLETE_FAILURE
} from '../types/lessonCompleteTypes';

const initialState = {
    lessonscomplete: [],  // Mảng lưu trữ các bài học đã hoàn thành
    loading: false,
    error: null
};

const lessonReducer = (state = initialState, action) => {
    switch (action.type) {
        case COMPLETE_LESSON_REQUEST:
            return { ...state, loading: true };
        case FETCH_LESSON_COMPLETE_REQUEST:
            return { ...state, loading: true };
        case COMPLETE_LESSON_SUCCESS:
            const { lessonId } = action.payload;
            return {
                ...state,
                loading: false,
                lessonscomplete: state.lessonscomplete.includes(lessonId) ? state.lessonscomplete : [...state.lessonscomplete, lessonId]
            };
        case COMPLETE_LESSON_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case FETCH_LESSON_COMPLETE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case FETCH_LESSON_COMPLETE_SUCCESS:
            return {
                ...state,
                loading: false,
                lessonscomplete: action.payload.map(item => item.lessonId)
            };
        default:
            return state;
    }
};

export default lessonReducer;
