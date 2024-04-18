// File: createprofilepage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProfile } from '../../redux/action/profileActions'; // Đảm bảo đường dẫn đúng
import styles from './createprofilepage.module.scss';
import logo from '../../assets/images/logo1.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const CreateProfilePage = () => {
    const { user } = useSelector(state => state.auth); // Giả sử authReducer lưu trữ thông tin người dùng
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(user._doc.email);
    const [gender, setGender] = useState('');
    const [country, setCountry] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.profile);
    const navigate = useNavigate(); // Khởi tạo navigate



    const handleRegister = async (e) => {
        e.preventDefault();
        const profileData = {
            id: user._doc.uid, // You'll need to replace 'some-uid' with actual uid from user data
            userName: username,
            email,
            gender,
            country
        };

        try {
            await dispatch(createProfile(profileData));
            // Chuyển hướng người dùng sau khi tạo profile thành công
            navigate('/browsecourse');
        } catch (error) {
            // Xử lý lỗi nếu cần
            console.error('Error creating profile:', error);
        }
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
                <p className={styles.textLogin}>Create Profile</p>
                <div className={styles.loginForm}>
                    <form onSubmit={handleRegister}>

                        <div className={styles.formControl}>
                            <input
                                className={styles.input}
                                type="username"
                                value={username}
                                placeholder='Username'
                                onChange={(e) => setUsername(e.target.value)}
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
                                disabled={true} // Disable input này
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

                        <div className={styles.formControl}>
                            <button type="submit" className={styles.button}>SIGN IN</button>
                        </div>
                    </form>




                </div>

            </div>
        </div>
    );
};


export default CreateProfilePage;
