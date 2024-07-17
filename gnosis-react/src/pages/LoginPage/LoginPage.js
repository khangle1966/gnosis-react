import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Login.module.scss'; // Assuming this is where your provided CSS is stored
import googleLogo from '../../assets/images/google1.png'; // Make sure the path is correct
import logo from '../../assets/images/logo1.png'; // Make sure the path is correct
import { login, loginWithGoogleAction } from '../../redux/action/authActions';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    // Lấy trạng thái đăng nhập từ Redux store
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    // Khởi tạo state để lưu email và mật khẩu
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Khởi tạo hook useDispatch để gửi action lên Redux store
    const dispatch = useDispatch();
    // Lấy trạng thái loading và lỗi từ Redux store
    const { loading, error } = useSelector(state => state.auth);
    // Lấy trạng thái hoàn thành hồ sơ từ Redux store
    const profileComplete = useSelector(state => state.auth.profileComplete);
    const profileCompleteGoogle = useSelector(state => state.auth.profileCompleteGoogle);

    // Khởi tạo hook useNavigate để điều hướng trang
    const navigate = useNavigate();

    // useEffect để điều hướng người dùng khi trạng thái đăng nhập thay đổi
    useEffect(() => {
        if (isLoggedIn) {
            if (!profileComplete && !profileCompleteGoogle) {
                navigate('/createprofile'); // Điều hướng đến trang tạo hồ sơ nếu hồ sơ chưa hoàn thành
            } else {
                navigate('/browsecourse'); // Điều hướng đến trang duyệt khóa học nếu hồ sơ đã hoàn thành
            }
        }
    }, [isLoggedIn, profileComplete, profileCompleteGoogle, navigate]);

    // Hàm xử lý khi người dùng nhấn nút đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(login(email, password)); // Gửi action đăng nhập với email và mật khẩu
    };

    // Hàm xử lý khi người dùng nhấn nút đăng nhập với Google
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            await dispatch(loginWithGoogleAction(response.access_token)); // Gửi action đăng nhập với Google
        },
    });
    return (
        <div className={styles.container}>
            <div className={styles.leftSection}></div> {/* Phần bên trái của giao diện */}
            <div className={styles.rightSection}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" /> {/* Hiển thị logo */}
                </div>
                <p className={styles.textLogin}>Login</p> {/* Văn bản "Login" */}
                <div className={styles.loginForm}>
                    <form onSubmit={handleLogin}> {/* Form đăng nhập */}
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
                        {error && (
                            <p style={{ color: '#FF0000', fontWeight: 'bold', margin: '10px 0', borderRadius: '5px', textAlign: 'center' }}>
                                {error} {/* Hiển thị thông báo lỗi nếu có */}
                            </p>
                        )}
                        <div className={styles.formControl}>
                            <button type="submit" disabled={loading} className={styles.button}>Login</button> {/* Nút đăng nhập */}
                        </div>
                    </form>
                    <div className={styles.separator}>OR</div> {/* Phân cách giữa các phương thức đăng nhập */}
                    <div className={styles.formControl}>
                        <button onClick={loginWithGoogle} type="button" className={styles.googleSignin}>
                            <img src={googleLogo} alt="Sign in with Google" style={{ marginRight: '1rem' }} />
                            Sign in with Google {/* Nút đăng nhập với Google */}
                        </button>
                    </div>
                </div>
                <div className={styles.footer}>
                    <p>Not registered? <a href="/register">Create an account</a></p> {/* Liên kết đến trang đăng ký */}
                    <div className={styles.trythis}>
                        <a href="/browsecoursenologin">Preview</a> {/* Liên kết đến trang xem trước không cần đăng nhập */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;