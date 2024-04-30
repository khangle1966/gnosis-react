import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../../redux/action/cartActions';
import styles from './cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { buyCourses } from '../../../redux/action/cartActions';
import { fetchProfile } from '../../../redux/action/profileActions'; // Đảm bảo đã import hành động updateProfile

const CartPage = () => {
    const dispatch = useDispatch();


    const cartItems = useSelector(state => state.cart.cartItems);
    const {profile} = useSelector (state => state.profile)
    const {user} = useSelector (state => state.auth)
    const [notification, setNotification] = useState({ show: false, message: '' });

    console.log ("halo",profile._id);
    useEffect(() => {
        dispatch(fetchProfile(user.uid));
    }, [dispatch,user.uid]);

    console.log('Images:', cartItems.map(item => item.img));
   

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleBuyAll = () => {
        dispatch(buyCourses(user.uid, cartItems));

        setNotification({ show: true, message: `Mua thành công "${cartItems.length}" khóa học.` });
        // Hide the notification after 3 seconds
        setTimeout(() => {
          setNotification({ show: false, message: '' });
        }, 3000);
    };
   
    const truncateNameCourse = (name) => {
        if (!name) return ''; // Kiểm tra nếu không tồn tại mô tả
        return name.length > 35 ? name.substring(0, 35) + '...' : name;
    };
  

    // Tính tổng tiền
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
                        <button onClick={handleBuyAll} className={styles.buyAllButton}>Buy</button>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default CartPage;
