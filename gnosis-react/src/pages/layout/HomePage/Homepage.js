import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { faSearch, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import styles from './HomePage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StatisticsComponent from './component/StatisticsComponent/StatisticsComponent';
import CalendarComponent from './component/CalendarComponent/CalendarComponent';
import { fetchProfile } from '../../../redux/action/profileActions';
import { fetchUserCourses } from '../../../redux/action/courseActions';
import { updateProfile } from '../../../redux/action/profileActions';

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userCourses, loading, error } = useSelector(state => state.course);
    const { user } = useSelector(state => state.auth);
    const { profile } = useSelector(state => state.profile);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const [activeTab, setActiveTab] = useState('all');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user && user.uid) {
            dispatch(fetchProfile(user.uid));
        } else {
            console.log('User is not defined or user.uid is not available');
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            if (profile && profile.courses) {
                dispatch(fetchUserCourses(profile.courses));
            }
        }
    }, [isLoggedIn, profile, dispatch, navigate]);

    useEffect(() => {
        let filtered = userCourses;

        if (activeTab === 'ongoing' && profile.ongoingCourse) {
            const ongoingCoursesIds = profile.ongoingCourse.map(id => id?._id?.toString() || '');
            filtered = userCourses.filter(course => ongoingCoursesIds.includes(course._id));
        } else if (activeTab === 'completed' && profile.completedCourse) {
            const completedCoursesIds = profile.completedCourse.map(id => id?._id?.toString() || '');
            filtered = userCourses.filter(course => completedCoursesIds.includes(course._id));
        }

        if (searchTerm) {
            filtered = filtered.filter(course =>
                (course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredCourses(filtered);
    }, [activeTab, userCourses, profile, searchTerm]);

    const handleStartCourse = (courseId) => {
        if (user && user.uid) {
            const updatedOngoingCourse = profile.ongoingCourse
                ? Array.from(new Set([...profile.ongoingCourse.map(id => id?._id?.toString() || ''), courseId.toString()]))
                : [courseId.toString()];
            const updatedProfile = { ...profile, ongoingCourse: updatedOngoingCourse };

            dispatch(updateProfile(updatedProfile, user.uid));

            navigate(`/course/${courseId}`);
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

    const handleEditClick = () => {
        navigate(`/profile`);
    };

    const getCurrentDate = () => {
        const currentDate = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return currentDate.toLocaleDateString('en-US', options);
    };

    const currentDate = getCurrentDate();

    return (
        <main className={styles.HomeContent}>
            <div className={styles.leftcolumn}>
                <header className={styles.header}>
                    <div className={styles.welcomendate}>
                        <div className={styles.Welcomeanddate}>
                            <h1 className={styles.welcometext}>WELCOME {profile.userName} TO GNOSIS</h1>
                            <div className={styles.date}>{currentDate}</div>
                        </div>
                        <div className={styles.searchBar}>
                            <FontAwesomeIcon icon={faSearch} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>
                <nav className={styles.navigation}>
                    <div className={styles.btncheck}>
                        <button className={activeTab === 'all' ? styles.active : ''} onClick={() => setActiveTab('all')}>Tất cả bài học</button>
                        <button className={activeTab === 'ongoing' ? styles.active : ''} onClick={() => setActiveTab('ongoing')}>Đang học</button>
                        <button className={activeTab === 'completed' ? styles.active : ''} onClick={() => setActiveTab('completed')}>Đã học xong</button>
                    </div>
                    <div className={styles.addIcon}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                </nav>
                <div className={styles.courseGrid}>
                    {loading && <div>Loading courses...</div>}
                    {error && <div>Error fetching courses: {error.message}</div>}
                    {filteredCourses.map(course => (
                        <div key={course._id} className={styles.courseCard}>
                            <div className={styles.courseImageWrapper}>
                                <img src={course.img} alt={course.name} />
                            </div>
                            <div className={styles.courseDetails}>
                                <h3>{truncateNameCourse(course.name)}</h3>
                                <p dangerouslySetInnerHTML={{ __html: truncateDescription(course.description) }}></p>
                                <div className={styles.courseActions}>
                                    <button onClick={() => handleStartCourse(course._id)}>Start</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`${styles.rightcolumn} show`}>
                <header className={styles.header}>
                    <h1>PROFILE USER</h1>
                    <button className={styles.editButton} onClick={handleEditClick}>
                        <FontAwesomeIcon icon={faEdit} />
                        Edit
                    </button>
                </header>
                <div className={styles.avatarWrapper}>
                    <img src={user?.picture} alt={`Avatar of ${user?.name}`} className={styles.avatar} />
                </div>
                <h2 className={styles.userName}>{profile.userName}</h2>
                <p className={styles.userEmail}>{profile.email}</p>
                <p className={styles.membership}>Role : {user.role}</p>
                <StatisticsComponent
                    rating={10}
                    timeSpent="2h"
                    coursesCompleted={12}
                />
                <CalendarComponent />
                <footer className={styles.footer}>
                    <p>Learn with passion, excel with dedication, and keep studying to infinity</p>
                </footer>
            </div>
        </main>
    );
};

export default HomePage;
