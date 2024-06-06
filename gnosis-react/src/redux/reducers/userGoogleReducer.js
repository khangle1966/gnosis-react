// userGoogleReducer.js
import {
    FETCH_USERGOOGLE_REQUEST,
    FETCH_USERGOOGLE_SUCCESS,
    FETCH_USERGOOGLE_FAILURE,
    DELETE_USERGOOGLE_REQUEST,
    DELETE_USERGOOGLE_SUCCESS,
    DELETE_USERGOOGLE_FAILURE,
    UPDATE_USERGOOGLE_REQUEST,
    UPDATE_USERGOOGLE_SUCCESS,
    UPDATE_USERGOOGLE_FAILURE,
    UPDATE_USERGOOGLE_PICURL_REQUEST,
    UPDATE_USERGOOGLE_PICURL_SUCCESS,
    UPDATE_USERGOOGLE_PICURL_FAILURE,
} from '../types/userGoogleTypes';

const initialState = {
    userGoogle: [],
    loading: false,
    error: null,
};

export const userGoogleReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERGOOGLE_REQUEST:
        case DELETE_USERGOOGLE_REQUEST:
        case UPDATE_USERGOOGLE_REQUEST:
        case UPDATE_USERGOOGLE_PICURL_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_USERGOOGLE_SUCCESS:
            return {
                ...state,
                loading: false,
                userGoogle: action.payload,
            };
        case DELETE_USERGOOGLE_SUCCESS:
            return {
                ...state,
                loading: false,
                userGoogle: state.userGoogle.filter(user => user.uid !== action.payload),
            };
        case UPDATE_USERGOOGLE_SUCCESS:
            return {
                ...state,
                loading: false,
                userGoogle: state.userGoogle.map(user =>
                    user.uid === action.payload.uid ? action.payload : user
                ),
            };
        case UPDATE_USERGOOGLE_PICURL_SUCCESS:
            return {
                ...state,
                loading: false,
                userGoogle: state.userGoogle.map(user =>
                    user.uid === action.payload.uid ? action.payload : user
                ),
            };
        case FETCH_USERGOOGLE_FAILURE:
        case DELETE_USERGOOGLE_FAILURE:
        case UPDATE_USERGOOGLE_FAILURE:
        case UPDATE_USERGOOGLE_PICURL_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
