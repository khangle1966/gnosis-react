const initialState = {
    ratings: [],
    loading: false,
    error: null,
};

export const ratingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SUBMIT_RATING_SUCCESS':
            return {
                ...state,
                ratings: [...state.ratings, action.payload],
            };
        case 'FETCH_RATINGS_SUCCESS':
            return {
                ...state,
                ratings: action.payload,
            };
        case 'SUBMIT_RATING_FAIL':
        case 'FETCH_RATINGS_FAIL':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};
