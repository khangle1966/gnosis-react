import axios from 'axios';

// Constants for action types
const FETCH_CART_REQUEST = 'FETCH_CART_REQUEST';
const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
const FETCH_CART_FAILURE = 'FETCH_CART_FAILURE';

const ADD_ITEM_REQUEST = 'ADD_ITEM_REQUEST';
const ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';
const ADD_ITEM_FAILURE = 'ADD_ITEM_FAILURE';

// Action to fetch cart details
export const fetchCart = () => async (dispatch) => {
    dispatch({ type: FETCH_CART_REQUEST });
    try {
        const response = await axios.get('http://localhost:3000/v1/cart');
        dispatch({
            type: FETCH_CART_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        dispatch({
            type: FETCH_CART_FAILURE,
            payload: error.response?.data.message ?? error.message
        });
    }
};

// Action to add an item to the cart
export const addItemToCart = (itemId) => async (dispatch) => {
    dispatch({ type: ADD_ITEM_REQUEST });
    try {
        const response = await axios.post(`http://localhost:3000/v1/cart/add`, { itemId });
        console.log('Response:', response.data); // Thêm để debug
        dispatch({
            type: ADD_ITEM_SUCCESS,
            payload: response.data
        });
        // Sau khi thêm mục vào giỏ hàng thành công, gửi yêu cầu để cập nhật lại giỏ hàng
        dispatch(fetchCart());
    } catch (error) {
        console.error("Error adding item to cart:", error);
        dispatch({
            type: ADD_ITEM_FAILURE,
            payload: error.response?.data.message ?? error.message
        });
    }
};
