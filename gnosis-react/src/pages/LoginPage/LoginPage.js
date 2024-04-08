import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Login.module.scss';
import logo from '../../assets/images/logo1.png'; // Đảm bảo đường dẫn chính xác
import { login, googleLogin } from '../../redux/action/loginActions';

const Login = () => {
    const isLoggedIn = useSelector(state => state.login.isLoggedIn);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.login);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home');
        }

        window.google?.accounts.id.initialize({
            client_id: "840218405895-07abtcjiasttgjuidc5rdjt5nlh667d4.apps.googleusercontent.com",
            callback: handleCredentialResponse,
        });

        window.google?.accounts.id.renderButton(
            document.getElementById('googleSignInBtn'),
            { theme: "outline", size: "large" }  // Cấu hình nút đăng nhập
        );
    }, [isLoggedIn, navigate, dispatch]);

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    const handleCredentialResponse = (response) => {
        console.log('Encoded JWT ID token from Google:', response.credential);
        // Gửi token này tới server hoặc xử lý tiếp tục trong ứng dụng của bạn
        dispatch(googleLogin(response.credential));
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                {/* Background image is set via CSS */}
            </div>
            <div className={styles.rightSection}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" />
                </div>
                <p className={styles.textLogin}>Login</p>
                <div className={styles.loginForm}>
                    <form onSubmit={handleLogin}>
                        <div className={styles.formControl}>
                            <input
                                className={styles.input}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email'
                                required
                            />
                        </div>
                        <div className={styles.formControl}>
                            <input
                                className={styles.input}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                                required
                            />
                        </div>
                        {error && <p style={{ color: '#FF0000', fontWeight: 'bold', margin: '10px 0', borderRadius: '5px', textAlign: 'center' }}>{error}</p>}
                        <div className={styles.formControl}>
                            <button type="submit" disabled={loading} className={styles.button}>Login</button>
                        </div>
                    </form>
                    <div className={styles.separator}>or</div>
                    <div id="googleSignInBtn" className={styles.formControl}></div> {/* Đây là nơi nút đăng nhập Google sẽ được render */}
                </div>
                <div className={styles.footer}>
                    <p>Not registered? <a href="/register">Create an account</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
