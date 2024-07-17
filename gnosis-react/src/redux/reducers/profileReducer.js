import {
    PROFILE_CREATE_REQUEST,
    PROFILE_CREATE_SUCCESS,
    PROFILE_CREATE_FAILURE,
    PROFILE_UPDATE_REQUEST,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_UPDATE_FAILURE,
    PROFILE_DELETE_REQUEST,
    PROFILE_DELETE_SUCCESS,
    PROFILE_DELETE_FAILURE,
    PROFILE_FETCH_REQUEST,
    PROFILE_FETCH_SUCCESS,
    PROFILE_FETCH_FAILURE,
    PROFILE_STATS_FETCH_REQUEST,
    PROFILE_STATS_FETCH_SUCCESS,
    PROFILE_STATS_FETCH_FAILURE,

} from '../types/profileActionTypes';

const initialState = {
    profile: {
        completedCourse: [] // Khởi tạo completedCourse là một mảng trống
    },
    stats: {},
    loading: false,
    error: null,
    isCheckingDuplicate: false,
    isDuplicate: false,
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROFILE_CREATE_REQUEST:
        case PROFILE_STATS_FETCH_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case PROFILE_STATS_FETCH_SUCCESS:
            return {
                ...state,
                stats: action.payload,
                loading: false,
                error: null,
            };
        case PROFILE_STATS_FETCH_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case PROFILE_DELETE_REQUEST:
            return { ...state, loading: true, error: null };
        case PROFILE_CREATE_SUCCESS:
        case PROFILE_UPDATE_REQUEST:
            return { ...state, loading: true, error: null };
        case PROFILE_UPDATE_SUCCESS:
            return { ...state, loading: false, profile: action.payload, error: null };
        case PROFILE_DELETE_SUCCESS:
            return { ...state, loading: false, profile: null, error: null };
        case PROFILE_CREATE_FAILURE:
        case PROFILE_UPDATE_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case PROFILE_DELETE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case PROFILE_FETCH_REQUEST:
            console.log('PROFILE_FETCH_REQUEST'); // Log khi action bắt đầu
            return { ...state, loading: true, error: null };
        case PROFILE_FETCH_SUCCESS:
            console.log('PROFILE_FETCH_SUCCESS', action.payload); // Log dữ liệu khi thành công
            return { ...state, loading: false, profile: action.payload, error: null };
        case PROFILE_FETCH_FAILURE:
            console.log('PROFILE_FETCH_FAILURE', action.payload); // Log lỗi khi thất bại
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default profileReducer;
