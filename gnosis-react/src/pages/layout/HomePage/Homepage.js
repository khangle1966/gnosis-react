import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { faSearch, faPlus, faEdit, faHeart } from '@fortawesome/free-solid-svg-icons';
import styles from './HomePage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StatisticsComponent from './component/StatisticsComponent/StatisticsComponent';
import CalendarComponent from './component/CalendarComponent/CalendarComponent';
import { fetchProfile } from '../../../redux/action/profileActions';
import { fetchUserCourses } from '../../../redux/action/courseActions';
import { fetchLessonsByCourseId } from '../../../redux/action/lessonActions'; // Import fetchLessonsByCourseId action
import { addToFavorite, removeFromFavorite, fetchFavorites } from '../../../redux/action/favoriteActions';
import { updateProfile } from '../../../redux/action/profileActions';

const HomePage = () => {
    const navigate = useNavigate(); // Khởi tạo hook điều hướng
    const dispatch = useDispatch(); // Khởi tạo hook dispatch để gửi hành động
    const { userCourses, loading, error } = useSelector(state => state.course); // Lấy danh sách khóa học của người dùng từ Redux store
    const { user } = useSelector(state => state.auth); // Lấy thông tin người dùng từ Redux store
    const { profile } = useSelector(state => state.profile); // Lấy thông tin hồ sơ người dùng từ Redux store
    const { favorites = [] } = useSelector(state => state.favorite); // Lấy danh sách yêu thích từ Redux store
    const lessonsByCourse = useSelector(state => state.lessonDetail); // Lấy thông tin bài học theo khóa học từ Redux store
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Kiểm tra trạng thái đăng nhập từ Redux store
    const [activeTab, setActiveTab] = useState('all'); // Trạng thái để lưu tab đang hoạt động (all, ongoing, completed, favorites)
    const [filteredCourses, setFilteredCourses] = useState([]); // Trạng thái để lưu danh sách khóa học đã lọc
    const [searchTerm, setSearchTerm] = useState(''); // Trạng thái để lưu từ khóa tìm kiếm

    // useEffect để lấy thông tin hồ sơ và danh sách yêu thích của người dùng khi user thay đổi
    useEffect(() => {
        if (user && user.uid) {
            dispatch(fetchProfile(user.uid));
            dispatch(fetchFavorites(user.uid));
        } else {
            console.log('User is not defined or user.uid is not available');
        }
    }, [dispatch, user]);

    // useEffect để kiểm tra trạng thái đăng nhập và lấy danh sách khóa học của người dùng khi profile thay đổi
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            if (profile && profile.courses) {
                dispatch(fetchUserCourses(profile.courses));
            }
        }
    }, [isLoggedIn, profile, dispatch, navigate]);

    // useEffect để lọc danh sách khóa học dựa trên tab đang hoạt động và từ khóa tìm kiếm
    useEffect(() => {
        let filtered = userCourses;

        if (activeTab === 'ongoing' && profile.ongoingCourse) {
            const ongoingCoursesIds = profile.ongoingCourse.map(id => id?._id?.toString() || '');
            filtered = userCourses.filter(course => ongoingCoursesIds.includes(course._id));
        } else if (activeTab === 'completed' && profile.completedCourse) {
            const completedCoursesIds = profile.completedCourse.map(id => id?._id?.toString() || '');
            filtered = userCourses.filter(course => completedCoursesIds.includes(course._id));
        } else if (activeTab === 'favorites') {
            const favoriteCourseIds = favorites.map(fav => fav);
            filtered = userCourses.filter(course => favoriteCourseIds.includes(course._id));
        }

        if (searchTerm) {
            filtered = filtered.filter(course =>
                (course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredCourses(filtered);
    }, [activeTab, userCourses, profile, favorites, searchTerm]);

    // Hàm để bắt đầu khóa học, điều hướng đến bài học đầu tiên của khóa học
    const handleStartCourse = async (courseId) => {
        if (user && user.uid) {
            await dispatch(fetchLessonsByCourseId(courseId));
            if (lessonsByCourse && lessonsByCourse.lessons && lessonsByCourse.lessons.length > 0) {
                const courseLessons = lessonsByCourse.lessons.filter(lesson => lesson.courseId === courseId);
                if (courseLessons.length > 0) {
                    const firstLessonId = courseLessons[0]._id;
                    const updatedOngoingCourse = profile.ongoingCourse
                        ? Array.from(new Set([...profile.ongoingCourse.map(id => id?._id?.toString() || ''), courseId.toString()]))
                        : [courseId.toString()];
                    const updatedProfile = { ...profile, ongoingCourse: updatedOngoingCourse };

                    dispatch(updateProfile(updatedProfile, user.uid));
                    navigate(`/course/${courseId}/lesson/${firstLessonId}`);
                } else {
                    console.error('No lessons found for the course.');
                }
            } else {
                console.error('No lessons found for the course.');
            }
        }
    };

    // Hàm để thêm hoặc xóa khóa học khỏi danh sách yêu thích
    const handleFavoriteCourse = (courseId) => {
        if (user && user.uid) {
            if (isCourseFavorited(courseId)) {
                dispatch(removeFromFavorite(user.uid, courseId));
            } else {
                dispatch(addToFavorite(user.uid, courseId));
            }
        }
    };

    // Hàm để kiểm tra xem khóa học có trong danh sách yêu thích hay không
    const isCourseFavorited = (courseId) => {
        return favorites.some(fav => fav === courseId);
    };

    // Hàm để rút ngắn mô tả khóa học
    const truncateDescription = (description) => {
        if (!description) return '';
        return description.length > 50 ? description.substring(0, 50) + '...' : description;
    };

    // Hàm để rút ngắn tên khóa học
    const truncateNameCourse = (name) => {
        if (!name) return '';
        return name.length > 50 ? name.substring(0, 50) + '...' : name;
    };

    // Hàm để điều hướng đến trang chỉnh sửa hồ sơ người dùng
    const handleEditClick = () => {
        navigate(`/profile`);
    };

    // Hàm để lấy ngày hiện tại dưới dạng định dạng đọc được
    const getCurrentDate = () => {
        const currentDate = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return currentDate.toLocaleDateString('en-US', options);
    };

    const currentDate = getCurrentDate(); // Lấy ngày hiện tại


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
                        <button className={`${activeTab === 'favorites' ? styles.activeFavorite : ''} ${styles.favoriteButton}`} onClick={() => setActiveTab('favorites')}>Khóa học yêu thích</button>
                    </div>
                    <div className={styles.addIcon}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                </nav>
                <div className={styles.courseGrid}>
                    {loading && <div>Loading courses...</div>}

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

                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className={`${styles.favoriteIcon} ${isCourseFavorited(course._id) ? styles.favorited : ''}`}
                                        onClick={() => handleFavoriteCourse(course._id)}
                                    />
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
