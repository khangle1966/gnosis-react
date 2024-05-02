import axios from 'axios';
import {
    REMOVE_FROM_CART,
    ADD_TO_CART,
    BUY_COURSES_SUCCESS,
     BUY_COURSES_FAIL
} from '../types/cartTypes'; 


export const addToCart = (item) => ({
    type: ADD_TO_CART,
    payload: item
});

export const removeFromCart = (itemId) => ({
    type: REMOVE_FROM_CART,
    payload: itemId
});


export const buyCourses = (userId, courses) => async (dispatch) => {
    try {
        const res = await axios.put(`http://localhost:3000/v1/profile/${userId}`, {
            courses: courses.map(course => course._id)  // Gửi chỉ ID của các khóa học
        });
        dispatch({
            type: BUY_COURSES_SUCCESS,
            payload: res.data // Assuming the response contains the updated user data
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