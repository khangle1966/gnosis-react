import { ADD_TO_CART, REMOVE_FROM_CART } from '../types/cartTypes';

// reducers/cartReducer.js

// reducers/cartReducer.js

const initialState = {
    cartItems: []
};


// Thêm vào file cartReducer.js
const cartReducer = (state = { cartItems: [] }, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const item = action.payload;
            const existItem = state.cartItems.find(x => x._id === item._id);
            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x =>
                        x._id === item._id ? { ...x, qty: x.qty + 1 } : x
                    )
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, { ...item, qty: 1 }]
                };
            }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x._id !== action.payload)
            };
        case 'INCREASE_QUANTITY':
            return {
                ...state,
                cartItems: state.cartItems.map(x =>
                    x._id === action.payload ? { ...x, qty: x.qty + 1 } : x
                )
            };
        case 'DECREASE_QUANTITY':
            return {
                ...state,
                cartItems: state.cartItems.map(x =>
                    x._id === action.payload ? { ...x, qty: x.qty > 1 ? x.qty - 1 : 1 } : x
                )
            };
        default:
            return state;
    }
};




export default cartReducer;



