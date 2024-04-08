import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/action/loginActions'; // Giả định bạn đã tạo action này
import styles from './HomePage.module.scss';

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.login.isLoggedIn); // Sử dụng trạng thái isLoggedIn từ Redux

    // Sử dụng useEffect để kiểm tra trạng thái đăng nhập
    React.useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const handleLogout = () => {
        dispatch(logout()); // Giả định bạn đã tạo action logout
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <h1>Trang Chủ</h1>
            <p>Chào mừng bạn đến với ứng dụng của chúng tôi!</p>
            <button onClick={handleLogout}>Đăng Xuất</button>
        </div>
    );
};

export default HomePage;
