import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './register.module.scss';
import logo from '../../assets/images/logo1.png';
import googleLogo from '../../assets/images/google1.png';
import { loginWithGoogleAction, register, resetRegisterSuccessMessage } from '../../redux/action/authActions';
import { useGoogleLogin } from '@react-oauth/google';

const Register = () => {
    // Lấy trạng thái đăng nhập từ Redux store
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    // Khởi tạo state để lưu email và mật khẩu
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Khởi tạo hook useDispatch để gửi action lên Redux store
    const dispatch = useDispatch();
    // Khởi tạo hook useNavigate để điều hướng trang
    const navigate = useNavigate();
    // Lấy trạng thái loading và lỗi từ Redux store
    const { loading, error } = useSelector(state => state.auth);
    // Lấy thông báo thành công đăng ký từ Redux store
    const { registerSuccessMessage } = useSelector(state => state.auth);
    // Khởi tạo state để lưu mật khẩu xác nhận
    const [confirmPassword, setConfirmPassword] = useState('');

    // useEffect để điều hướng người dùng khi trạng thái đăng nhập thay đổi
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/browsecourse');
        }
    }, [isLoggedIn, navigate]);

    // useEffect để hiển thị thông báo khi đăng ký thành công
    useEffect(() => {
        if (registerSuccessMessage) {
            alert(registerSuccessMessage);
            navigate('/login');
            dispatch(resetRegisterSuccessMessage()); // Đặt lại thông báo khi điều hướng
        }
    }, [registerSuccessMessage, navigate, dispatch]);

    // useEffect để đặt lại thông báo khi rời khỏi trang đăng ký
    useEffect(() => {
        return () => {
            dispatch(resetRegisterSuccessMessage()); // Đặt lại thông báo khi rời khỏi trang
        };
    }, [dispatch]);

    // Hàm đăng nhập với Google
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            dispatch(loginWithGoogleAction(response.access_token));
        },
    });

    // Hàm xử lý khi người dùng nhấn nút đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match.'); // Kiểm tra nếu mật khẩu không khớp
            return;
        }
        dispatch(register(email, password)); // Gửi action đăng ký với email và mật khẩu
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                {/* Background image is set via CSS */}
            </div>
            <div className={styles.rightSection}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" /> {/* Hiển thị logo */}
                </div>
                <p className={styles.textLogin}>Register</p> {/* Văn bản "Register" */}
                <div className={styles.loginForm}>
                    <form onSubmit={handleRegister}> {/* Form đăng ký */}
                        <div className={styles.formControl}>
                            <input
                                className={styles.input}
                                type="email"
                                value={email}
                                placeholder='Email'
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formControl}>
                            <input
                                className={styles.input}
                                type="password"
                                value={password}
                                placeholder='Password'
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formControl}>
                            <input
                                className={styles.input}
                                type="password"
                                value={confirmPassword}
                                placeholder='Confirm Password'
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <p style={{ color: '#FF0000', fontWeight: 'bold', margin: '10px 0', borderRadius: '5px', textAlign: 'center' }}>
                                {error} {/* Hiển thị thông báo lỗi nếu có */}
                            </p>
                        )}
                        <div className={styles.formControl}>
                            <button type="submit" disabled={loading} className={styles.button}>Register</button> {/* Nút đăng ký */}
                        </div>
                    </form>
                    <div className={styles.separator}>OR</div> {/* Phân cách giữa các phương thức đăng nhập */}
                    <div className={styles.formControl}>
                        <button onClick={loginWithGoogle}
                            type="button"
                            className={styles.googleSignin}
                        >
                            <img
                                src={googleLogo}
                                alt="Sign in with Google"
                                style={{ marginRight: '1rem' }}
                            />
                            Sign in with Google {/* Nút đăng nhập với Google */}
                        </button>
                    </div>
                </div>
                <div className={styles.footer}>
                    <p>Already have an account? <a href="/Login">Login here</a></p> {/* Liên kết đến trang đăng nhập */}
                </div>
            </div>
        </div>
    );
};

export default Register;
