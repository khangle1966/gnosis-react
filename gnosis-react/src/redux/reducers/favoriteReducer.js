import {
    ADD_TO_FAVORITE_REQUEST,
    ADD_TO_FAVORITE_SUCCESS,
    ADD_TO_FAVORITE_FAILURE,
    REMOVE_FROM_FAVORITE_REQUEST,
    REMOVE_FROM_FAVORITE_SUCCESS,
    REMOVE_FROM_FAVORITE_FAILURE,
    FETCH_FAVORITES_REQUEST,
    FETCH_FAVORITES_SUCCESS,
    FETCH_FAVORITES_FAILURE,
} from '../types/favoriteTypes';

const initialState = {
    favorites: [],
    loading: false,
    error: null,
};

const favoriteReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_FAVORITE_REQUEST:
        case REMOVE_FROM_FAVORITE_REQUEST:
        case FETCH_FAVORITES_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ADD_TO_FAVORITE_SUCCESS:
        case REMOVE_FROM_FAVORITE_SUCCESS:
        case FETCH_FAVORITES_SUCCESS:
            return {
                ...state,
                loading: false,
                favorites: action.payload.favorites,
            };
        case ADD_TO_FAVORITE_FAILURE:
        case REMOVE_FROM_FAVORITE_FAILURE:
        case FETCH_FAVORITES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default favoriteReducer;
