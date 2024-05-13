import {
    UPLOAD_IMAGE_REQUEST,
    UPLOAD_IMAGE_SUCCESS,
    UPLOAD_IMAGE_FAILURE,
    UPLOAD_VIDEO_REQUEST,
    UPLOAD_VIDEO_SUCCESS,
    UPLOAD_VIDEO_FAILURE,
    UPLOAD_VIDEO_PROGRESS,
    FETCH_VIDEO_REQUEST,
    FETCH_VIDEO_SUCCESS,
    FETCH_VIDEO_FAILURE
} from '../types/uploadtypes';

const initialState = {
    loading: false,
    imageData: null,
    error: null
};
const initialVideoState = {
    loading: false,
    videoURL: null,
    uploadProgress: 0,
    error: null,

};
export const imageUploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_IMAGE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case UPLOAD_IMAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                imageData: action.payload,
                error: null
            };
        case UPLOAD_IMAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};
export const videoUploadReducer = (state = initialVideoState, action) => {
    switch (action.type) {
        case UPLOAD_VIDEO_REQUEST:
            return { ...state, loading: true, error: null, uploadProgress: 0 };
        case UPLOAD_VIDEO_PROGRESS:
            return { ...state, uploadProgress: action.payload }; // Cập nhật tiến trình
        case UPLOAD_VIDEO_SUCCESS:
            return { ...state, loading: false, videoURL: action.payload, uploadProgress: 100, error: null };
        case UPLOAD_VIDEO_FAILURE:
            return { ...state, loading: false, error: action.payload, uploadProgress: 0 };
        case FETCH_VIDEO_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_VIDEO_SUCCESS:
            return { ...state, loading: false, videoURL: action.payload, error: null };
        case FETCH_VIDEO_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};