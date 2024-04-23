import React from 'react';
import { useSelector } from 'react-redux';
import styles from './cart.module.scss';

const CartPage = () => {
    const cartItems = useSelector(state => state.cart.items); // Giả sử bạn đã có items trong state của cart

    return (
        <div className={styles.cartPage}>
            <div className={styles.cartHeader}>
                <h2>Bạn có {cartItems.length} khóa học trong giỏ hàng</h2>
            </div>
            <div className={styles.cartContent}>
                <div className={styles.cartItems}>
                    {cartItems.map((item, index) => (
                        <div key={index} className={styles.cartItem}>
                            <div className={styles.productDetails}>
                                <span className={styles.productName}>{item.name}</span>
                                <span className={styles.productPrice}>{item.price}</span>
                                <button className={styles.removeItem}>×</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CartPage;
