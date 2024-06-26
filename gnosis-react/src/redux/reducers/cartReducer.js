import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    BUY_COURSES_SUCCESS,
    BUY_COURSES_FAIL,
    PAYMENT_SUCCESS,
    PAYMENT_FAIL
} from '../types/cartTypes';

const initialState = {
    cartItems: [],
    userCourses: [],
    error: null,
    paymentStatus: null
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
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
        case REMOVE_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item._id !== action.payload)
            };
        case BUY_COURSES_SUCCESS:
            return {
                ...state,
                userCourses: action.payload.courses, // Lưu ý payload phải phù hợp với dữ liệu trả về
                cartItems: [] // Làm trống giỏ hàng sau khi mua
            };
        case BUY_COURSES_FAIL:
            return {
                ...state,
                error: action.payload
            };
        case PAYMENT_SUCCESS:
            return {
                ...state,
                paymentStatus: 'success',
                cartItems: [] // Làm trống giỏ hàng sau khi thanh toán thành công
            };
        case PAYMENT_FAIL:
            return {
                ...state,
                paymentStatus: 'fail',
                error: action.payload
            };
        default:
            return state;
    }
};

export default cartReducer;
