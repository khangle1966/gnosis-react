// HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.scss'; // Updated styles file

import logoImage from '../../assets/images/logo1.png'; // Update these paths as needed
import webDeveloperImage from '../../assets/images/web developer.jpg';
import englishImage from '../../assets/images/english.jpg';
import mathImage from '../../assets/images/math.webp';
import scienceImage from '../../assets/images/science.jpg';

const Welcome = () => {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(1); // Assuming the first slide is active by default

    const handleLogin = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Function to change the active slide
    const changeSlide = (slideNumber) => {
        setActiveSlide(slideNumber);
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageLogo}>
                <img src={logoImage} alt="Logo" className={styles.logo} /> {/* Updated to use className */}
            </div>
            <div className={styles.boxGreen}>
                <div className={styles.titleText}>
                    <p className={styles.slogan}>LEARNING IS THE EYE OF THE MIND</p>
                    <p className={styles.description}>
                        Gnosis is an online learning platform that gives anyone, anywhere access to online courses
                    </p>
                    <div className={styles.btn}>
                        <button className="btn2" onClick={handleLogin}>SIGN IN NOW</button>
                    </div>
                </div>
                <div className={styles.footerGreen}>
                    <p className={styles.address}>4 Bùi Viện, Phường 1, Quận 1, Tp. Hồ Chí Minh</p>
                </div>
            </div>
            <div className={styles.boxWhite}>
                <div className={styles.containerSubject}>
                    <div className={styles.slider}>
                        <div className={styles.titleSubject}>
                            <p className={styles.subject}>ILLUSTRATION COURSE</p>
                        </div>
                        <div className={styles.images}>
                            {/* We are using inline style for demonstration; 
                                this could be moved to the SCSS file as well */}
                            <img
                                style={{ display: activeSlide === 1 ? 'block' : 'none' }}
                                src={webDeveloperImage}
                                alt="Web Developer"

                            />
                            <img
                                style={{ display: activeSlide === 2 ? 'block' : 'none' }}
                                src={englishImage}
                                alt="Web Developer"

                            />
                            <img
                                style={{ display: activeSlide === 3 ? 'block' : 'none' }}
                                src={mathImage}
                                alt="Web Developer"

                            />
                            <img
                                style={{ display: activeSlide === 4 ? 'block' : 'none' }}
                                src={scienceImage}
                                alt="Web Developer"

                            />

                            {/* Repeat for other images with updated conditionals */}
                        </div>
                        <div className={styles.dots}>
                            {/* These labels would be clickable to change the active slide */}
                            <label onClick={() => changeSlide(1)}></label>
                            {/* Repeat for other labels with updated functions */}
                        </div>
                        {/* Auto navigation buttons would also be clickable */}
                        <div className={styles.navigationAuto}>
                            <div onClick={() => changeSlide(1)} className={activeSlide === 1 ? styles.autoBtn1Active : styles.autoBtn1}></div>
                            {/* Repeat for other navigation buttons */}
                        </div>
                    </div>
                </div>
                <div className={styles.footerWhite}>
                    <b>Hotline: 0854021102</b>
                    {/* Social icons would go here */}
                </div>
            </div>
        </div>
    );
};

export default Welcome;
