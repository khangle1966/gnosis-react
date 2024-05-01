import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, fetchProfile, updateProfile } from '../../../redux/action/profileActions'; // Đảm bảo đã import hành động updateProfile

import styles from './ProfilePage.module.scss';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { profile, loading, error } = useSelector(state => state.profile);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [formData, setFormData] = useState({
        userName: '',
        gender: 'male',
        country: '',
        bio: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                userName: profile.userName || '',
                gender: profile.gender || 'male',
                country: profile.country || '',
                bio: profile.bio || ''
            });
        }
    }, [profile]);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(updateProfile(formData, user.uid));
            setNotification({ message: 'Profile updated successfully!', type: 'success' });
        } catch (err) {
            setNotification({ message: 'Failed to update profile. Please try again.', type: 'error' });
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.profilePage}>
            {notification.message && (
                <div className={notification.type === 'success' ? styles.successMessage : styles.errorMessage}>
                    {notification.message}
                </div>
            )}
            <header className={styles.profileHeader}>
                <h1>Profile</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
                    Log out
                </button>
            </header>
            <main className={styles.profileContent}>
                <section className={styles.leftColumn}>
                    <img src={user?.picture} alt={`Avatar of ${user?.name}`} className={styles.avatar} />
                    <h2 className={styles.userName}>{formData.userName}</h2>
                    <p className={styles.userEmail}>{user?.email}</p>
                </section>
                <section className={styles.middleColumn}>
                    <h2>Edit your Personal Settings</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="userName">User Name</label>
                                <input type="text" id="userName" value={formData.userName} onChange={handleChange} placeholder="User Name..." />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="gender">Gender</label>
                                <select id="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.inputGroupSingle}>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="Email..." value="" disabled />
                        </div>
                        <div className={styles.inputGroupSingle}>
                            <label htmlFor="country">Country</label>
                            <input type="text" id="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                        </div>
                        <div className={styles.inputGroupSingle}>
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio" value={formData.bio} onChange={handleChange} placeholder="Describe yourself..."></textarea>
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
                                <button>Start</button>
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
                                <button>Start</button>
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
