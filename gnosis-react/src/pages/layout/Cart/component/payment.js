import React from 'react';
import { Link } from 'react-router-dom';
import styles from './payment.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const PaymentPage = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ show: false, message: '' });
  const handleSubmit = (event) => {
    event.preventDefault();  // Ngăn không cho form gửi thông thường


    // Thay đổi dưới đây: Hiển thị thông báo mua hàng thành công
    setNotification({ show: true, message: 'Payment successful!' });

    // Giả sử xử lý thanh toán thành công, điều hướng người dùng
    setTimeout(() => {
      setNotification({ show: false, message: '' }); // Ẩn thông báo
      navigate('/home');  // Điều hướng người dùng về trang chủ
    }, 1000);  // Điều hướng sau 1 giây
  };


  return (
    <div className={styles.payment}>
      {notification.show && (
        <div className={styles.notification}>
          {notification.message}
        </div>
      )}
      <h1>Payment</h1>
      <form onSubmit={handleSubmit}>
        <h2>Customer Information:</h2>
        <div>
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" required />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" name="address" required />
        </div>

        <h2>Choose your payment method:</h2>
        <div>
          <input type="radio" id="cod" name="paymentMethod" value="cod" />
          <label htmlFor="cod">Cash on Delivery</label>
        </div>
        <div>
          <input type="radio" id="momo" name="paymentMethod" value="momo" />
          <label htmlFor="momo">Momo Wallet</label>
        </div>
        <button type="submit">Buy All</button>
      </form>

      <Link to="/cart" className={styles.link}>Return to Cart</Link>
    </div>
  );
}

export default PaymentPage;
