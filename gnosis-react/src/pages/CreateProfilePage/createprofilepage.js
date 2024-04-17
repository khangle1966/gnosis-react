
import React, { useState } from 'react';


import { useSelector } from 'react-redux';
import styles from './createprofilepage.module.scss'; // Assuming this is where your provided CSS is stored
import logo from '../../assets/images/logo1.png'; // Make sure the path is correct


const CreateProfilePage = () => {
    const [gender, setGender] = useState('');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');

    const [username, setusername] = useState('');

    const { loading, error } = useSelector(state => state.auth);





    const handleRegister = async (e) => {
        console.log("kakakak")

    }


    return (

        <div className={styles.container}>
            <div className={styles.leftSection}>
                {/* Background image is set via CSS */}
            </div>
            <div className={styles.rightSection}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" />
                </div>
                <p className={styles.textLogin}>Create Profile</p>
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

                            <select
                                className={styles.input}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >

                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className={styles.formControl}>

                            <select
                                className={styles.input}
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >

                                {/* Here you would list countries. For example: */}
                                <option value="usa">United States</option>
                                <option value="canada">Canada</option>
                                <option value="campodia">Campodia</option>
                                <option value="vietnam">Việt Nam</option>

                                {/* Add additional country options here */}
                            </select>
                        </div>
                        {error && <p style={{ color: '#FF0000', fontWeight: 'bold', margin: '10px 0', borderRadius: '5px', textAlign: 'center', }}>{error} </p>}
                        <div className={styles.formControl}>
                            <button type="submit" disabled={loading} className={styles.button}>SIGN IN</button>
                        </div>
                    </form>




                </div>

            </div>
        </div>
    );
};

export default CreateProfilePage;