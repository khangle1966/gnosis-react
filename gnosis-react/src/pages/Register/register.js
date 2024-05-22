import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './register.module.scss';
import logo from '../../assets/images/logo1.png';
import googleLogo from '../../assets/images/google1.png';
import { loginWithGoogleAction, register, resetRegisterSuccessMessage } from '../../redux/action/authActions';
import { useGoogleLogin } from '@react-oauth/google';

const Register = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);
    const { registerSuccessMessage } = useSelector(state => state.auth);
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/browsecourse');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (registerSuccessMessage) {
            alert(registerSuccessMessage);
            navigate('/login');
            dispatch(resetRegisterSuccessMessage()); // Đặt lại thông báo khi điều hướng
        }
    }, [registerSuccessMessage, navigate, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetRegisterSuccessMessage()); // Đặt lại thông báo khi rời khỏi trang
        };
    }, [dispatch]);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            dispatch(loginWithGoogleAction(response.access_token));
        },
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        dispatch(register(email, password));
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
