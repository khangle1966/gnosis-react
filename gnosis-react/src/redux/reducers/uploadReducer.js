import {
    UPLOAD_IMAGE_REQUEST,
    UPLOAD_IMAGE_SUCCESS,
    UPLOAD_IMAGE_FAILURE
} from '../types/uploadtypes';

const initialState = {
    loading: false,
    imageData: null,
    error: null
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
