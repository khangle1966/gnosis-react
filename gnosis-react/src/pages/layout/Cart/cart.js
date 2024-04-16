import React, { useState } from 'react';
import styles from './cart.module.scss';

const CartPage = () => {
    // State để lưu trữ giá trị nhập vào ô tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // Giả sử bạn sẽ tải dữ liệu giỏ hàng từ một API hoặc Context/Redux Store
    const cartItems = [
        { id: 1, name: 'IT - Web Developer', price: '$899' },
        { id: 2, name: 'Graphic Design Course', price: '$699' },
        // Thêm các mục khác vào đây
    ];

    // Hàm để xử lý thay đổi giá trị nhập vào ô tìm kiếm
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Hàm để thực hiện chức năng tìm kiếm
    const search = (item) => {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    };

    return (
        <div className={styles.cartPage}>
            <div className={styles.searchContainer}>
                <input type="text" id="searchInput" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
            </div>

            <div className={styles.seacrhUnderline}>
                
            </div>
            <div cla    ssName={styles.cartHeader}>
                <h2>You have {cartItems.length} items in your cart</h2>
            </div>
            
            <div className={styles.cartContent}>
                <div className={styles.cartItems}>
                    {cartItems.filter(search).map((item, index) => (
                        <CartItem key={item.id} name={item.name} price={item.price} />
                    ))}
                </div>
                <div className={styles.cartSummary}>
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
};

const CartItem = ({ name, price }) => {
    return (
        <div className={styles.cartItem}>
            <div className={styles.productDetails}>
                <span className={styles.productName}>{name}</span>
                <span className={styles.productPrice}>{price}</span>
                <button className={styles.removeItem}>×</button>
            </div>
        </div>
    );
};

const OrderSummary = () => {
    const total = '$899';
    const discount = '-$0';

    return (
        <div className={styles.orderSummary}>
            <h3>Order</h3>
            <div className={styles.summaryItem}>
                <span>Provisional</span>
                <span>{total}</span>
            </div>
            <div className={styles.summaryItem}>
                <span>Discount</span>
                <span>{discount}</span>
            </div>
            <div className={styles.total}>
                <span>Total</span>
                <span>{total}</span>
            </div>
            <button className={styles.checkoutButton}>Buy</button>
        </div>
    );
};

export default CartPage;
