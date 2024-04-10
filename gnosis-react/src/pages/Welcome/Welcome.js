// Welcome.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.scss';

import logoImage from '../../assets/images/logolanding.png';
import webDeveloperImage from '../../assets/images/web developer.jpg';
import englishImage from '../../assets/images/english.jpg';
import mathImage from '../../assets/images/math.webp';
import scienceImage from '../../assets/images/science.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Welcome = () => {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
        { image: webDeveloperImage, title: 'Web Developer' },
        { image: englishImage, title: 'English' },
        { image: mathImage, title: 'Math' },
        { image: scienceImage, title: 'Science' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prevActiveSlide) => (prevActiveSlide + 1) % slides.length);
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval); // Clean up interval on unmount
    }, [slides.length]);

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <img src={logoImage} alt="GNOSIS Logo" className={styles.logo} />
            </div>
            <div className={styles.left}>
                <div className={styles.introduce}>
                    <h1>Learning is the eye of the mind</h1>
                    <p>Gnosis is an online learning platform that gives anyone, anywhere access to online courses</p>
                    <button onClick={handleLogin} className={styles.getStartedButton}>Get Started</button>
                </div>
                <div className={styles.footer}>
                    <p>8 Nguyễn Văn Tráng, Phường Bến Thành, Quận 1, Tp. Hồ Chí Minh</p>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.container_subject}>
                    <div className={styles.slider}>
                        <div className={styles.images}
                            style={{ transform: `translateX(-${activeSlide * 25}%)` }}> {/* Đây là phần đã thay đổi */}
                            {slides.map((slide, index) => (
                                <img
                                    key={slide.title}
                                    className={index === activeSlide ? styles.active : styles.slide}
                                    src={slide.image}
                                    alt={slide.title}
                                />
                            ))}
                        </div>
                        <div className={styles.dots}>
                            {slides.map((_, index) => (
                                <span
                                    key={index}
                                    className={index === activeSlide ? styles.dotActive : styles.dot}
                                    onClick={() => setActiveSlide(index)}
                                ></span>
                            ))}
                        </div>
                        <p className={styles.subject}>{slides[activeSlide].title}</p>
                    </div>
                </div>
                <div className={styles.footer_white}>
                    <b className={styles.hotline}>Hotline: 0808123508</b>
                    <div className={styles.container_social}>
                        <b className={styles.socialLabel}>Follow us on:</b>
                        <div className={styles.icon_social}>
                            <FontAwesomeIcon icon={faFacebook} className={styles.socialIcon} />
                            <FontAwesomeIcon icon={faYoutube} className={styles.socialIcon} />
                            <FontAwesomeIcon icon={faInstagram} className={styles.socialIcon} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
