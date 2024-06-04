import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, createVNPayPayment } from '../../../redux/action/cartActions';
import { fetchProfile } from '../../../redux/action/profileActions';
import styles from './cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const CartPage = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.cartItems);
    const { profile, loading: profileLoading } = useSelector(state => state.profile);
    const { user } = useSelector(state => state.auth);
    const [notification] = useState({ show: false, message: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState(cartItems);

    useEffect(() => {
        if (user && user.uid) {
            dispatch(fetchProfile(user.uid));
        } else {
            console.log("User data is not available.");
        }
    }, [dispatch, user]);

    useEffect(() => {
        setFilteredItems(
            cartItems.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, cartItems]);

    useEffect(() => {
        if (!profileLoading && profile && profile.courses && cartItems.length > 0) {
            checkAndRemoveDuplicateCourses();
        }
    }, [profile, profileLoading, cartItems]);

    const handleRemoveFromCart = (id) => {
        console.log(`Removing item from cart: ${id}`);
        dispatch(removeFromCart(id));
    };

    const handleVNPayPayment = () => {
        const amount = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
        const orderId = Date.now().toString(); // Unique order ID
        const orderInfo = 'Payment for courses'; // Information about the order
        const returnUrl = 'http://localhost:3000/payment-success'; // URL to redirect to after payment
        dispatch(createVNPayPayment(amount, orderId, orderInfo, returnUrl, user.uid, cartItems));
    };

    const checkAndRemoveDuplicateCourses = () => {
        if (profile && profile.courses && cartItems) {

            cartItems.forEach(item => {
                console.log(`Checking item: ${item._id}`);
                if (profile.courses.some(course => course._id.toString() === item._id.toString())) {
                    handleRemoveFromCart(item._id);
                }
            });
        }
    };

    const truncateNameCourse = (name) => {
        if (!name) return '';
        return name.length > 35 ? name.substring(0, 35) + '...' : name;
    };

    const totalPrice = filteredItems.reduce((total, item) => total + item.price * item.qty, 0);

    return (
        <div className={styles.cartPage}>
            {notification.show && (
                <div className={styles.notification}>
                    {notification.message}
                </div>
            )}
            <header className={styles.cartHeader}>
                <div className={styles.breadcrumbs}>Home &gt;&gt; Cart</div>
                <div className={styles.searchBar}>
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <main className={styles.cartContent}>
                <section className={styles.leftColumn}>
                    <h2>Bạn có {filteredItems.length} khóa học trong giỏ hàng</h2>
                    {filteredItems.map((item, index) => (
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
                        <button onClick={handleVNPayPayment} className={styles.buyAllButton}>Thanh toán bằng VNPay</button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CartPage;