// userGoogleReducer.js
import {
    FETCH_USERGOOGLE_REQUEST,
    FETCH_USERGOOGLE_SUCCESS,
    FETCH_USERGOOGLE_FAILURE,
    BAN_USERGOOGLE_REQUEST,
    BAN_USERGOOGLE_SUCCESS,
    BAN_USERGOOGLE_FAILURE,
    UNBAN_USERGOOGLE_REQUEST,
    UNBAN_USERGOOGLE_SUCCESS,
    UNBAN_USERGOOGLE_FAILURE,
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
        case BAN_USERGOOGLE_REQUEST:
        case UNBAN_USERGOOGLE_REQUEST:
            return {
                ...state,
                loading: true,
            };
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
        case BAN_USERGOOGLE_SUCCESS:
        case UNBAN_USERGOOGLE_SUCCESS:
            return {
                ...state,
                loading: false,
                userGoogle: state.userGoogle.map(user =>
                    user.uid === action.payload.uid ? action.payload : user
                ),
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
        case BAN_USERGOOGLE_FAILURE:
        case UNBAN_USERGOOGLE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
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
