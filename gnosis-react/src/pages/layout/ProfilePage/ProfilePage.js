import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import styles from './ProfilePage.module.scss';

const ProfilePage = () => {



    return (

        <div className={styles.profilePage}>
            <header className={styles.profileHeader}>
                <h1>Profile</h1>
                <button className={styles.logoutButton}>
                    <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
                    Log out

                </button>
            </header>
            <main className={styles.profileContent}>
                <section className={styles.leftColumn}>
                    <img src="https://news.harvard.edu/wp-content/uploads/2022/11/iStock-mathproblems.jpg" alt="Cris Ronaldo" className={styles.avatar} />
                    <h2 className={styles.userName}>Cris Ronaldo</h2>
                    <p className={styles.userEmail}>messi7@gmail.com</p>
                </section>
                <section className={styles.middleColumn}>
                    <h2>Edit your Personal Settings</h2>
                    <form>
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="userName">User Name</label>
                                <input type="text" id="userName" placeholder="Phùng" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="gender">Gender</label>
                                <select id="gender">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.inputGroupSingle}>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="khoachoco@gmail.com" />
                        </div>

                        <div className={styles.inputGroupSingle}>
                            <label htmlFor="country">Country</label>
                            <input type="text" id="country" placeholder="Việt Nam" />
                        </div>

                        <div className={styles.inputGroupSingle}>
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio" placeholder="Tôi mong muốn được cải thiện bản thân."></textarea>
                        </div>

                        <button type="submit" className={styles.updateProfileButton}>Update Profile</button>
                    </form>
                </section>
                <section className={styles.rightColumn}>
                    <h2 className={styles.coursesHeader}>Courses</h2>
                    <div className={styles.courseCard}>
                        <div className={styles.courseImageWrapper}>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPvQLTxQkoXnT2W9bAC6FhhVbwrIjnchyPP-uCNVphXw&s" alt="Responsive Web Design" />
                        </div>
                        <div className={styles.courseContent}>
                            <h3 className={styles.courseTitle}>Responsive Web Design</h3>
                            <p className={styles.courseSubtitle}>Web Developer</p>
                            <div className={styles.courseButtons}>
                                <button>Quất</button>
                                <button>Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.courseCard}>
                        <div className={styles.courseImageWrapper}>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPvQLTxQkoXnT2W9bAC6FhhVbwrIjnchyPP-uCNVphXw&s" alt="Responsive Web Design" />
                        </div>
                        <div className={styles.courseContent}>
                            <h3 className={styles.courseTitle}>Responsive Web Design</h3>
                            <p className={styles.courseSubtitle}>Web Developer</p>
                            <div className={styles.courseButtons}>
                                <button>Quất</button>
                                <button>Cancel</button>
                            </div>
                        </div>
                    </div>
                    {/* Thêm các courseCard khác tương tự */}
                </section>

            </main>
        </div>
    );
};

export default ProfilePage;
