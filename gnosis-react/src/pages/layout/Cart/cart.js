import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, buyCourses } from '../../../redux/action/cartActions';
import { fetchProfile } from '../../../redux/action/profileActions';
import styles from './cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Thay đổi ở đây

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Thay đổi ở đây
    const cartItems = useSelector(state => state.cart.cartItems);
    const { profile } = useSelector(state => state.profile);
    const { user } = useSelector(state => state.auth);
    const [notification, setNotification] = useState({ show: false, message: '' });

    useEffect(() => {
        dispatch(fetchProfile(profile.uid));
    }, [dispatch, profile.uid]);

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id));
    };

    useEffect(() => {
        if (user && user.uid) {
            dispatch(fetchProfile(user.uid));
        } else {
            console.log("User data is not available.");
        }
    }, [dispatch, user]);
    

    const handleBuyAll = () => {
        if (user && user.uid) {
            dispatch(buyCourses(user.uid, cartItems));
            setNotification({ show: true, message: `Mua thành công "${cartItems.length}" khóa học.` });
            setTimeout(() => {
                setNotification({ show: false, message: '' });
            }, 3000);
            navigate('/payment');
        } else {
            // Handle when user data is not available
            console.log('User data is not available. Redirecting to login page.');
            navigate('/login');  // Assuming '/login' is your login route
        }
    };
    
    

    const truncateNameCourse = (name) => {
        if (!name) return '';
        return name.length > 35 ? name.substring(0, 35) + '...' : name;
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

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
                        <button onClick={handleBuyAll} className={styles.buyAllButton}>Payment</button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CartPage;
