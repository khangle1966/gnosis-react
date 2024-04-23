// reducers/chapterReducer.js
import {
    FETCH_CHAPTERS_REQUEST,
    FETCH_CHAPTERS_SUCCESS,
    FETCH_CHAPTERS_FAILURE,
    SET_CHAPTER_ID,
    ADD_CHAPTER_SUCCESS,
    REMOVE_CHAPTER_SUCCESS // Đảm bảo rằng bạn đã khai báo action type này trong file chapterTypes.js
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
            return { ...state, loading: false, chapters: action.payload, error: null };
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
        default:
            return state;
    }
};
