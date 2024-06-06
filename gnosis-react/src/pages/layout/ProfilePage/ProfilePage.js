import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile2 } from '../../../redux/action/profileActions';
import { logout } from '../../../redux/action/authActions';
import { fetchUserCourses } from '../../../redux/action/courseActions';
import { uploadAvatar } from '../../../redux/action/userGoogleActions';
import styles from './ProfilePage.module.scss';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { profile } = useSelector(state => state.profile);
    const [notification, setNotification] = useState({ show: false, message: '' });
    const { userCourses, loading, error } = useSelector(state => state.course);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    const [formData, setFormData] = useState({
        userName: '',
        gender: 'male',
        country: '',
        bio: ''
    });

    const [userPicture, setUserPicture] = useState(user?.picture);
    const fileInputRef = useRef(null);

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
        dispatch(fetchProfile(user.uid));
    }, [dispatch, user.uid]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else if (profile && profile.courses) {
            dispatch(fetchUserCourses(profile.courses));
        }
    }, [isLoggedIn, profile, dispatch, navigate]);

    useEffect(() => {
        setUserPicture(user?.picture);
    }, [user]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        });
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setUserPicture(URL.createObjectURL(file));
            await dispatch(uploadAvatar(file, user.uid));
        }
    };

    const truncateDescription = (description) => {
        if (!description) return '';
        return description.length > 50 ? description.substring(0, 50) + '...' : description;
    };

    const truncateNameCourse = (name) => {
        if (!name) return '';
        return name.length > 50 ? name.substring(0, 50) + '...' : name;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(updateProfile2(formData, user.uid));
            setNotification({ show: true, message: `Profile "${user.uid}" updated successfully!` });
        } catch (err) {
            setNotification({ show: false, message: 'Failed to update profile. Please try again.' });
        }
        setTimeout(() => {
            setNotification({ show: false, message: '' });
        }, 3000);
    };

    const handleDescriptionClick = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.profilePage}>
            {notification.show && (
                <div className={styles.notification}>
                    {notification.message}
                </div>
            )}
            <div className={styles.breadcrumbs}>Home &gt;&gt; Profile</div>
            <header className={styles.profileHeader}>
                <h1>Profile</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
                    Log out
                </button>
            </header>
            <main className={styles.profileContent}>
                <section className={styles.leftColumn}>
                    <img src={userPicture} alt={`Avatar of ${user?.name}`} className={styles.avatar} onClick={handleAvatarClick} />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                    />
                    <h2 className={styles.userName}>{profile.userName}</h2>
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
                            <input type="email" id="email" placeholder="Email..." value={user?.email} disabled />
                        </div>
                        <div className={styles.inputGroupSingle}>
                            <label htmlFor="country">Country</label>
                            <select id="country" value={formData.country} onChange={handleChange}>
                                <option value="">Select a country...</option>
                                <option value="Vietnam">Việt Nam</option>
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Australia">Australia</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="Japan">Japan</option>
                                <option value="South Korea">South Korea</option>
                                <option value="China">China</option>
                                <option value="Singapore">Singapore</option>
                                <option value="New Zealand">New Zealand</option>
                            </select>
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
                    {loading && <div>Loading courses...</div>}
                    {error && <div>Error fetching courses: {error.message}</div>}
                    {userCourses && userCourses.map(course => (
                        <div className={styles.courseCard} key={course._id}>
                            <div className={styles.courseImageWrapper}>
                                <img src={course.img} alt={course.name} />
                            </div>
                            <div className={styles.courseContent}>
                                <h3 className={styles.courseTitle}>{truncateNameCourse(course.name)}</h3>
                                <p className={styles.courseSubtitle}>{truncateDescription(course.description)}</p>
                                <div className={styles.courseButtons}>
                                    <button onClick={() => handleDescriptionClick(course._id)}>Start</button>
                                    <button>Cancel</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
