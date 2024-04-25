import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../../../redux/action/cartActions';
import styles from './cart.module.scss';

const CartPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleBuyAll = () => {
        console.log('Buying all items:', cartItems);
        // Thêm logic để xử lý mua hàng ở đây, ví dụ chuyển hướng tới trang thanh toán
    };

    const handleIncreaseQuantity = (id) => {
        dispatch(increaseQuantity(id));
    };

    const handleDecreaseQuantity = (id) => {
        const currentItem = cartItems.find(item => item._id === id);
        if (currentItem.qty > 1) {
            dispatch(decreaseQuantity(id));
        }
    };

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

    return (
        <div className={styles.cartPage}>
            <h2>Bạn có {cartItems.length} khóa học trong giỏ hàng</h2>
            {cartItems.map((item, index) => (
                <div key={index} className={styles.item}>
                    <span>{item.name} - {item.qty} x ${item.price.toFixed(2)}</span>
                    <div className={styles.controls}>
                        <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                        <button onClick={() => handleIncreaseQuantity(item._id)}>+</button>
                        <button onClick={() => handleRemoveFromCart(item._id)}>x</button>
                    </div>
                </div>
            ))}
            <div className={styles.totalSection}>
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
                <button onClick={handleBuyAll} className={styles.buyAllButton}>Buy All Courses</button>
            </div>
        </div>
    );
};

export default CartPage;
