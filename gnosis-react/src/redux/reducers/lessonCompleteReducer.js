import {
    COMPLETE_LESSON_REQUEST,
    COMPLETE_LESSON_SUCCESS,
    COMPLETE_LESSON_FAILURE,
    FETCH_LESSON_COMPLETE_REQUEST,
    FETCH_LESSON_COMPLETE_SUCCESS,
    FETCH_LESSON_COMPLETE_FAILURE
} from '../types/lessonCompleteTypes';

const initialState = {
    lessonscomplete: [],  // Sử dụng tên này để lưu trữ các bài học đã hoàn thành
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
            // Đảm bảo không thêm trùng lặp ID bài học
            const { lessonId } = action.payload;
            const isAlreadyCompleted = state.lessonscomplete.includes(lessonId);
            return {
                ...state,
                loading: false,
                lessonscomplete: isAlreadyCompleted ? state.lessonscomplete : [...state.lessonscomplete, lessonId]
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
            // Đảm bảo payload là một mảng và ánh xạ để lấy ID nếu nó không chỉ là ID
            return {
                ...state,
                loading: false,
                lessonscomplete: Array.isArray(action.payload) ? action.payload.map(item => item.lessonId) : state.lessonscomplete
            };
        default:
            return state;
    }
};

export default lessonReducer;
