import axios from 'axios';
import {
    REMOVE_FROM_CART,
    ADD_TO_CART
} from '../types/cartTypes'; 


export const addToCart = (item) => ({
    type: 'ADD_TO_CART',
    payload: item
});

export const removeFromCart = (itemId) => ({
    type: 'REMOVE_FROM_CART',
    payload: itemId
});

export const increaseQuantity = (id) => ({
    type: 'INCREASE_QUANTITY',
    payload: id
});

export const decreaseQuantity = (id) => ({
    type: 'DECREASE_QUANTITY',
    payload: id
});
