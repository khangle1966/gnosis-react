<<<<<<< HEAD
// HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.scss'; // Make sure this SCSS is compiled from your LESS
=======
// Welcome.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.scss';
>>>>>>> 916cca0 (a)

import logoImage from '../../assets/images/logolanding.png';
import webDeveloperImage from '../../assets/images/web developer.jpg';
import englishImage from '../../assets/images/english.jpg';
import mathImage from '../../assets/images/math.webp';
import scienceImage from '../../assets/images/science.jpg';
<<<<<<< HEAD

const Welcome = () => {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState('img1');
=======
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Welcome = () => {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(0);
>>>>>>> 916cca0 (a)

    const slides = [
        { image: webDeveloperImage, title: 'Web Developer' },
        { image: englishImage, title: 'English' },
<<<<<<< HEAD

        { image: mathImage, title: 'Web Math' },
        { image: scienceImage, title: 'Science' },

        // Thêm các slide khác ở đây
    ];
    const handleLogin = () => {
        // This should be the link to your login page
        navigate('/login');
    };

    // const handleSlideChange = (newIndex) => {
    //     setActiveSlide(newIndex);
    // };
=======
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

>>>>>>> 916cca0 (a)
    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <img src={logoImage} alt="GNOSIS Logo" className={styles.logo} />
            </div>
            <div className={styles.left}>
                <div className={styles.introduce}>
                    <h1>Learning is the eye of the mind</h1>
                    <p>Gnosis is an online learning platform that gives anyone, anywhere access to online courses</p>
<<<<<<< HEAD
                    <button className={styles.getStartedButton}>Get Started</button>
=======
                    <button onClick={handleLogin} className={styles.getStartedButton}>Get Started</button>
>>>>>>> 916cca0 (a)
                </div>
                <div className={styles.footer}>
                    <p>8 Nguyễn Văn Tráng, Phường Bến Thành, Quận 1, Tp. Hồ Chí Minh</p>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.container_subject}>
                    <div className={styles.slider}>
<<<<<<< HEAD
                        <div className={styles.title_subject}>

                        </div>
                        <div className={styles.images}>
                            <input type="radio" name="slide" id="img1" checked />
                            <input type="radio" name="slide" id="img2" />
                            <input type="radio" name="slide" id="img3" />
                            <input type="radio" name="slide" id="img4" />

                            <img className={styles.m1} src={webDeveloperImage} alt="img1" />
                            <img className={styles.m2} src={englishImage} alt="img2" />
                            <img className={styles.m3} src={mathImage} alt="img3" />
                            <img className={styles.m4} src={scienceImage} alt="img4" />
                        </div>
                        <p className={styles.subject}  >
                            Web Developer
                        </p>
                        <div className={styles.dots}>
                            <label for="img1"></label>
                            <label for="img2"></label>
                            <label for="img3"></label>
                            <label for="img4"></label>
                        </div>
                        <div className={styles.navigation_auto}>
                            <div className={styles.auto_btn1}></div>
                            <div className={styles.auto_btn2}></div>
                            <div className={styles.auto_btn3}></div>
                            <div className={styles.auto_btn4}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.footer_white}>
                    <b className={styles.hotline}>Hotline: 0854021102</b>
                    <div className={styles.container_social} >
                        <b className={styles.Social} >Social</b>
                        <div id="icon_social">
                            <tui-svg class="social" src="tuiIconFacebookLarge"></tui-svg>
                            <tui-svg class="social" src="tuiIconYoutubeLarge"></tui-svg>
                            <tui-svg class="social" src="tuiIconInstagramLarge"></tui-svg>
=======
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
>>>>>>> 916cca0 (a)
                        </div>
                    </div>
                </div>
            </div>
        </div>
<<<<<<< HEAD

=======
>>>>>>> 916cca0 (a)
    );
};

export default Welcome;
