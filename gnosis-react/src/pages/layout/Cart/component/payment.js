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

  const handlePayment = async () => {
    const paymentData = {
      partnerCode: 'MOMOBKUN20180529',
      accessKey: 'klm05TvNBzhg7h7j',
      secretKey: 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa',
      orderId: new Date().getTime().toString(),
      orderInfo: 'Thanh toán qua MoMo',
      amount: '10000',
      ipnUrl: 'https://localhost:4000/cart',
      redirectUrl: 'https://localhost:4000/cart',
      extraData: ''
    };
  
    try {
      const response = await fetch('/momo/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
      const result = await response.json();
      window.location.href = result.url; // Redirect the user to MoMo payment gateway
    } catch (error) {
      console.error('Failed to initiate payment:', error);
    }
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
          <button name="submitPayment" onClick={handlePayment}>Thanh toán qua MoMo</button>
      </form>

      <Link to="/cart" className={styles.link}>Return to Cart</Link>
    </div>
  );
}

export default PaymentPage;
