import axios from 'axios';
import {
    REMOVE_FROM_CART,
    ADD_TO_CART,
    BUY_COURSES_SUCCESS,
    BUY_COURSES_FAIL,
    PAYMENT_SUCCESS,
    PAYMENT_FAIL
} from '../types/cartTypes';

// Hàm hành động để thêm một mục vào giỏ hàng
export const addToCart = (item) => ({
    type: ADD_TO_CART,
    payload: item
});

// Hàm hành động để xóa một mục khỏi giỏ hàng
export const removeFromCart = (id) => (dispatch) => {
    dispatch({
        type: REMOVE_FROM_CART,
        payload: id
    });
};

// Hàm hành động để mua các khóa học
export const buyCourses = (userId, courses) => async (dispatch) => {
    try {
        const res = await axios.put(`http://localhost:3000/v1/profile/${userId}`, {
            courses: courses.map(course => course._id)  // Gửi chỉ ID của các khóa học
        });
        dispatch({
            type: BUY_COURSES_SUCCESS,
            payload: res.data // Giả định rằng phản hồi chứa dữ liệu người dùng được cập nhật
        });
    } catch (error) {
        dispatch({
            type: BUY_COURSES_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        });
    }
};

// Hàm hành động để tạo URL thanh toán VNPay
export const createVNPayPayment = (amount, orderId, orderInfo, returnUrl, userId, cartItems) => async (dispatch) => {
    try {
        const courseIds = cartItems.map(item => item._id);
        const params = new URLSearchParams({
            amount,
            orderId,
            bankCode: '',
            returnUrl,
            userId,
            courseIds: courseIds.join(',')
        }).toString();

        const { data } = await axios.get(`http://localhost:3000/vnpay/create-payment-url?${params}`);
        console.log('Payment URL received from server:', data.paymentUrl);
        window.location.href = data.paymentUrl;
    } catch (error) {
        console.error('Error creating VNPay payment URL:', error);
        dispatch(paymentFail(error));
    }
};

// Hành động thành công khi thanh toán
export const paymentSuccess = () => ({
    type: PAYMENT_SUCCESS
});

// Hành động thất bại khi thanh toán
export const paymentFail = (error) => ({
    type: PAYMENT_FAIL,
    payload: error
});
