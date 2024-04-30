import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import styles from './HomePage.module.scss';

import StatisticsComponent from './component/StatisticsComponent/StatisticsComponent';
import CalendarComponent from './component/CalendarComponent/CalendarComponent';
import { fetchProfile } from '../../../redux/action/profileActions'; // Đảm bảo đã import hành động updateProfile
import { fetchUserCourses } from '../../../redux/action/courseActions';

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userCourses, loading, error } = useSelector(state => state.course);
    const { user } = useSelector(state => state.auth)
    const { profile } = useSelector(state => state.profile);
    console.log(profile.course)

    useEffect(() => {
        dispatch(fetchProfile(user.uid));
    }, [dispatch, user.uid]);



    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else if (profile && profile.courses) {
            dispatch(fetchUserCourses(profile.courses));
        }
    }, [isLoggedIn, profile, dispatch, navigate]);


    const handleDescriptionClick = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    const truncateDescription = (description) => {
        if (!description) return ''; // Kiểm tra nếu không tồn tại mô tả
        return description.length > 50 ? description.substring(0, 50) + '...' : description;
    };
    const truncateNameCourse = (name) => {
        if (!name) return ''; // Kiểm tra nếu không tồn tại mô tả
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
                            <input type="text" placeholder="Search..." />
                        </div>
                    </div>




                </header>
                <nav className={styles.navigation}>

                    <div className={styles.btncheck}>
                        <button>Chưa học</button>
                        <button>Đang học</button>
                        <button>Đã học xong</button>

                    </div>
                    <div className={styles.addIcon}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>

                </nav>
                <div className={styles.courseGrid}>

                    {loading && <div>Loading courses...</div>}
                    {error && <div>Error fetching courses: {error.message}</div>}
                    {userCourses && userCourses.map(course => (
                        <div key={course._id} className={styles.courseCard}>

                            <div className={styles.courseImageWrapper}>
                                <img src={course.img} alt={course.name} />
                            </div>
                            <div className={styles.courseDetails}>
                                <h3>{truncateNameCourse(course.name)}</h3>
                                <p>{truncateDescription(course.description)}</p>
                                <div className={styles.courseActions}>
                                    <button onClick={() => handleDescriptionClick(course._id)}>Start</button>
                                    {/* Thêm nút "Cancel" nếu cần */}
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
