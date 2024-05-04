// reducers/chapterReducer.js
import {
    FETCH_CHAPTERS_REQUEST,
    FETCH_CHAPTERS_SUCCESS,
    FETCH_CHAPTERS_FAILURE,
    SET_CHAPTER_ID,
    ADD_CHAPTER_SUCCESS,
    REMOVE_CHAPTER_SUCCESS,
    UPDATE_CHAPTER_REQUEST,
    UPDATE_CHAPTER_SUCCESS,
    UPDATE_CHAPTER_FAILURE,
    UPDATE_CHAPTER_ORDER_REQUEST,
    UPDATE_CHAPTER_ORDER_SUCCESS,
    UPDATE_CHAPTER_ORDER_FAILURE, //Đảm bảo rằng bạn đã khai báo action type này trong file chapterTypes.js
} from '../types/chapterTypes';

const initialState = {
    chapters: [],
    loading: false,
    error: null,
    chapterId: null, // Thêm chapterId vào trạng thái ban đầu
};

export const chapterReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CHAPTERS_REQUEST:
            return { ...state, loading: true };
        case FETCH_CHAPTERS_SUCCESS:
            return {
                ...state,
                loading: false,
                chapters: Array.isArray(action.payload) ? action.payload : [],
                error: null
            };

        case FETCH_CHAPTERS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case SET_CHAPTER_ID: // Xử lý action mới để set chapterId
            return { ...state, chapterId: action.payload };
        case ADD_CHAPTER_SUCCESS:
            return {
                ...state,
                chapters: [...state.chapters, action.payload]
            };
        case REMOVE_CHAPTER_SUCCESS:
            return {
                ...state,
                chapters: state.chapters.filter(chapter => chapter._id !== action.payload)
            };
        case UPDATE_CHAPTER_REQUEST:
            return { ...state, loading: true };
        case UPDATE_CHAPTER_SUCCESS:
            return {
                ...state,
                loading: false,
                chapters: state.chapters.map(chapter =>
                    chapter._id === action.payload._id ? action.payload : chapter
                )
            };
        case UPDATE_CHAPTER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case UPDATE_CHAPTER_ORDER_REQUEST:
            return { ...state, loading: true };
        case UPDATE_CHAPTER_ORDER_SUCCESS:
            // Kiểm tra xem payload có phải là mảng không trước khi cập nhật state
            return {
                ...state,
                loading: false,
                chapters: Array.isArray(action.payload.chapters) ? action.payload.chapters : [],
                error: null
            };

        case UPDATE_CHAPTER_ORDER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        // Other cases remain unchanged
        case 'SET_CHAPTERS':
            return {
                ...state,
                chapters: action.payload
            };
        default:
            return state;
    }
};
