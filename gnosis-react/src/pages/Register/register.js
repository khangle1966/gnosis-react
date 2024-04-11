
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import styles from './register.module.scss'; // Assuming this is where your provided CSS is stored
import logo from '../../assets/images/logo1.png'; // Make sure the path is correct
import googleLogo from '../../assets/images/google1.png'; // Make sure the path is correct
import { loginWithGoogleAction } from '../../redux/action/authActions';
import { useGoogleLogin } from '@react-oauth/google';
import { register } from '../../redux/action/authActions';


const Register = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setusername] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);
    const { registerSuccessMessage } = useSelector(state => state.auth);
    const [confirmPassword, setConfirmPassword] = useState('');


    useEffect(() => {
        if (isLoggedIn) {
            navigate('/browsecourse'); // Chuyển hướng nếu đã đăng nhập
        }
    }, [isLoggedIn, navigate]);
    useEffect(() => {
        if (registerSuccessMessage) {
            alert(registerSuccessMessage); // Hiển thị thông báo sử dụng alert hoặc một thành phần thông báo tùy chỉnh
            navigate('/login'); // Chuyển hướng về trang đăng nhập
        }
    }, [registerSuccessMessage, navigate]);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            dispatch(loginWithGoogleAction(response.access_token)); // Đảm bảo rằng đây là access_token
        },
    });

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return; // Stop the function from proceeding further
        }

        dispatch(register(username, email, password));
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
                <p className={styles.textLogin}>Register</p>
                <div className={styles.loginForm}>
                    <form onSubmit={handleRegister}>

                        <div className={styles.formControl}>
                            <input
                                className={styles.input}
                                type="username"
                                value={username}
                                placeholder='Username'
                                onChange={(e) => setusername(e.target.value)}
                                required
                            />
                        </div>
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
                        {error && <p style={{ color: '#FF0000', fontWeight: 'bold', margin: '10px 0', borderRadius: '5px', textAlign: 'center', }}>{error} </p>}
                        <div className={styles.formControl}>
                            <button type="submit" disabled={loading} className={styles.button}>Register</button>
                        </div>
                    </form>
                    <div className={styles.separator}>OR</div>

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
                            Sign in with Google
                        </button>
                    </div>

                </div>
                <div className={styles.footer}>
                    <p>Already have an account? <a href="/Login">Login here</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;