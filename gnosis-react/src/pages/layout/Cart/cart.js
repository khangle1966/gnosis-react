import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../../../redux/action/cartActions';
import styles from './cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const CartPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    console.log('Images:', cartItems.map(item => item.img));
    const dispatch = useDispatch();

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleBuyAll = () => {
        console.log('Buying all items:', cartItems);
        // Thêm logic để xử lý mua hàng ở đây, ví dụ chuyển hướng tới trang thanh toán
    };
    const truncateNameCourse = (name) => {
        if (!name) return ''; // Kiểm tra nếu không tồn tại mô tả
        return name.length > 35 ? name.substring(0, 35) + '...' : name;
    };
  

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

    return (

        <div className={styles.cartPage}>
            <header className={styles.cartHeader}>
                <div className={styles.breadcrumbs}>Home &gt;&gt; Cart</div>


                <div className={styles.searchBar}>
                    <FontAwesomeIcon icon={faSearch} />
                    <input type="text" placeholder="Search..." />
                </div>

            </header>

            <main className={styles.cartContent}>


                <section className={styles.leftColumn}>
                <h2>Bạn có {cartItems.length} khóa học trong giỏ hàng</h2>

                    {cartItems.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.course}>
                                <img src={item.img} alt={item.name} />
                              
                                <h3>{truncateNameCourse(item.name)}</h3>

                            </div>
                            <div className={styles.price}>
                                <span>${item.price.toFixed(2)}</span>
                            </div>
                           
                            <div className={styles.remove}>
                                <button onClick={() => handleRemoveFromCart(item._id)}>x</button>
                            </div>
                        </div>
                    ))}
                </section>

                <section className={styles.rightColumn}>
                    <div className={styles.totalSection}>
                        <h3>Order</h3>
                        <hr />
                        <div className={styles.lineItem}>
                            <span>Provisional</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className={styles.lineItem}>
                            <span>Discount</span>
                            <span>-$0</span>
                        </div>
                        <hr />
                        <div className={styles.totalPrice}>
                            <strong>Total:</strong> ${totalPrice.toFixed(2)}
                        </div>
                        <button onClick={handleBuyAll} className={styles.buyAllButton}>Buy</button>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default CartPage;
