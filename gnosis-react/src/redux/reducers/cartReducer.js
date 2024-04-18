// Initial state of the cart
const initialState = {
    cartItems: [],
    loading: false,
    error: null
};

// Action types
const FETCH_CART_REQUEST = 'FETCH_CART_REQUEST';
const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
const FETCH_CART_FAILURE = 'FETCH_CART_FAILURE';

const ADD_ITEM_REQUEST = 'ADD_ITEM_REQUEST';
const ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';
const ADD_ITEM_FAILURE = 'ADD_ITEM_FAILURE';

// Cart reducer function
const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CART_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_CART_SUCCESS:
            return {
                ...state,
                cartItems: action.payload,
                loading: false
            };
        case FETCH_CART_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case ADD_ITEM_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case ADD_ITEM_SUCCESS:
            // Assuming payload contains the added item details
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload],
                loading: false
            };
        case ADD_ITEM_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default cartReducer;
