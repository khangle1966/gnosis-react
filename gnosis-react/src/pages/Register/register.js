import React, { useState } from 'react';
import {useSelector } from 'react-redux';
import styles from './register.module.scss'; // Assuming this is where your provided CSS is stored
import logo from '../../assets/images/logo1.png'; // Make sure the path is correct



const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setusername] = useState('');
    
    const { loading, error } = useSelector(state => state.login);

    

    const handleRegister = async (e) => {

       console.log ("A")

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
                        {error && <p style={{ color: '#FF0000', fontWeight: 'bold', margin: '10px 0', borderRadius: '5px', textAlign: 'center', }}>{error} </p>}
                        <div className={styles.formControl}>
                            <button type="submit" disabled={loading} className={styles.button}>Register</button>
                        </div>
                    </form>
                    <div className={styles.separator}>OR</div>

                    <div className={styles.formControl}>
                            <button type="submit" disabled={loading} className={styles.googleSignin}>Sign in with Google</button>
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