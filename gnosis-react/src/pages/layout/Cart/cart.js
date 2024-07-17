// Import các thư viện và hành động cần thiết
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, createVNPayPayment } from '../../../redux/action/cartActions';
import { fetchProfile } from '../../../redux/action/profileActions';
import styles from './cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const CartPage = () => {
    const dispatch = useDispatch(); // Khởi tạo hook dispatch để gửi hành động đến Redux store
    const cartItems = useSelector(state => state.cart.cartItems); // Lấy danh sách các mặt hàng trong giỏ hàng từ Redux store
    const { profile, loading: profileLoading } = useSelector(state => state.profile); // Lấy thông tin profile và trạng thái tải profile từ Redux store
    const { user } = useSelector(state => state.auth); // Lấy thông tin người dùng từ Redux store
    const [notification] = useState({ show: false, message: '' }); // Trạng thái thông báo
    const [searchTerm, setSearchTerm] = useState(''); // Trạng thái từ khóa tìm kiếm
    const [filteredItems, setFilteredItems] = useState(cartItems); // Trạng thái các mặt hàng đã lọc

    // useEffect để lấy thông tin profile khi người dùng đã đăng nhập
    useEffect(() => {
        if (user && user.uid) {
            dispatch(fetchProfile(user.uid)); // Gửi hành động lấy thông tin profile
        } else {
            console.log("User data is not available.");
        }
    }, [dispatch, user]);

    // useEffect để lọc các mặt hàng trong giỏ hàng theo từ khóa tìm kiếm
    useEffect(() => {
        setFilteredItems(
            cartItems.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, cartItems]);

    // useEffect để kiểm tra và loại bỏ các khóa học trùng lặp trong giỏ hàng
    useEffect(() => {
        if (!profileLoading && profile && profile.courses && cartItems.length > 0) {
            checkAndRemoveDuplicateCourses(); // Gọi hàm kiểm tra và loại bỏ khóa học trùng lặp
        }
    }, [profile, profileLoading, cartItems]);

    // Hàm xử lý khi người dùng xóa mặt hàng khỏi giỏ hàng
    const handleRemoveFromCart = (id) => {
        console.log(`Removing item from cart: ${id}`);
        dispatch(removeFromCart(id)); // Gửi hành động xóa mặt hàng khỏi giỏ hàng
    };

    // Hàm xử lý khi người dùng thanh toán bằng VNPay
    const handleVNPayPayment = () => {
        const amount = cartItems.reduce((total, item) => total + item.price * item.qty, 0); // Tính tổng số tiền
        const orderId = Date.now().toString(); // Tạo ID đơn hàng duy nhất
        const orderInfo = 'Payment for courses'; // Thông tin về đơn hàng
        const returnUrl = 'http://localhost:3000/payment-success'; // URL chuyển hướng sau khi thanh toán
        dispatch(createVNPayPayment(amount, orderId, orderInfo, returnUrl, user.uid, cartItems)); // Gửi hành động tạo thanh toán VNPay
    };

    // Hàm kiểm tra và loại bỏ các khóa học trùng lặp trong giỏ hàng
    const checkAndRemoveDuplicateCourses = () => {
        if (profile && profile.courses && cartItems) {
            cartItems.forEach(item => {
                console.log(`Checking item: ${item._id}`);
                if (profile.courses.some(course => course._id.toString() === item._id.toString())) {
                    handleRemoveFromCart(item._id); // Loại bỏ khóa học trùng lặp
                }
            });
        }
    };

    // Hàm rút ngắn tên khóa học nếu quá dài
    const truncateNameCourse = (name) => {
        if (!name) return '';
        return name.length > 35 ? name.substring(0, 35) + '...' : name;
    };

    // Tính tổng số tiền của các mặt hàng trong giỏ hàng đã lọc
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