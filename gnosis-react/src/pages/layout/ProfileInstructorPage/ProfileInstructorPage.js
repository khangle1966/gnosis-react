import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchProfile, fetchProfileStats } from '../../../redux/action/profileActions';
import { fetchCoursesByAuthor } from '../../../redux/action/courseActions'; // Import action mới
import styles from './ProfileInstructorPage.module.scss'; // Tạo file SCSS nếu cần
import { fetchUserGoogleById } from '../../../redux/action/userGoogleActions';


const ProfileInstructorPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Sử dụng useNavigate
    const { profile, loading: profileLoading, error: profileError } = useSelector(state => state.profile || {});
    const { stats, loading: statsLoading, error: statsError } = useSelector(state => state.profile || {});
    const { courses, loading: coursesLoading, error: coursesError } = useSelector(state => state.course || {});
    const [showMoreProfile, setShowMoreProfile] = useState(false);
    const { userGoogle } = useSelector(state => state.userGoogle); // Lấy dữ liệu userGoogle từ state
    useEffect(() => {
        if (id) {
            dispatch(fetchProfile(id));
            dispatch(fetchProfileStats(id));
            dispatch(fetchCoursesByAuthor(id)); // Gọi action để lấy các khóa học của tác giả
            dispatch(fetchUserGoogleById(id)); // Gọi action để lấy các khóa học của tác giả

        }
    }, [dispatch, id]);

    if (profileLoading || statsLoading || coursesLoading) {
        return <div>Đang tải...</div>;
    }

    if (profileError || statsError || coursesError) {
        return <div>Có lỗi xảy ra: {profileError || statsError || coursesError}</div>;
    }

    const toggleShowMoreProfile = () => {
        setShowMoreProfile(!showMoreProfile);
    };
    const truncateDescription = (description) => {
        if (!description) return '';
        return description.length > 50 ? description.substring(0, 50) + '...' : description;
    };

    const truncateNameCourse = (name) => {
        if (!name) return '';
        return name.length > 50 ? name.substring(0, 50) + '...' : name;
    };

    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}`); // Điều hướng đến trang chi tiết khóa học
    };


    const profileDescription = profile.description || ''; // Giá trị mặc định cho profile.description

    return (
        <div className={styles.profileInstructorPage}>
            <div className={styles.profileHeader}>
                <div className={styles.profileImage}>
                    <img src={userGoogle.picture || 'https://via.placeholder.com/150'} alt="Instructor" />
                </div>
                <div className={styles.profileInfo}>
                    <h1>{profile.userName}</h1>
                    <p>{profile.bio}</p>
                    <div className={styles.profileStats}>
                        <div>Tổng học viên :</div>
                        <div className={styles.statNumber}>{stats ? stats.totalStudents : 'Loading...'}</div>
                        <div>Tổng số đánh giá :</div>
                        <div className={styles.statNumber}>{stats ? stats.totalRating : 'Loading...'}</div>
                        <div>Số khóa học :</div>
                        <div className={styles.statNumber}>{stats ? stats.totalCourses : 'Loading...'}</div>
                    </div>
                </div>
            </div>
            <div className={styles.socialLinks}>
                <button>Trang web</button>
                <button>Facebook</button>
                <button>Youtube</button>
            </div>

            <div className={styles.profileContent}>
                <h2>Giới thiệu về tôi</h2>
                <p>Hi there...</p>
                <div className={styles.profileDescription} dangerouslySetInnerHTML={{ __html: showMoreProfile ? profileDescription : `${profileDescription.substring(0, 900)}...` }}></div>

                {profileDescription > 900 && (
                    <button onClick={toggleShowMoreProfile} className={styles.toggleButton}>
                        {showMoreProfile ? 'Ẩn bớt' : 'Hiển thị tất cả'}
                    </button>
                )}
            </div>

            <div className={styles.coursesSection}>
                <h2>Các khóa học của tôi ({courses ? courses.length : 'Loading...'})</h2>
                <div className={styles.coursesGrid}>
                    {courses && courses.map(course => (
                        <div
                            key={course._id}
                            className={styles.courseCard}
                            onClick={() => handleCourseClick(course._id)} // Thêm onClick handler
                        >
                            <img src={course.img} alt={course.title} className={styles.courseImage} />
                            <h3>{truncateNameCourse(course.name)}</h3>
                            <p dangerouslySetInnerHTML={{ __html: truncateDescription(course.description) }}></p>
                            <p>{course.rating} <span className={styles.stars}>★</span> ({course.numberOfReviews} đánh giá)</p>
                            <p>Có {course.numberOfStudents} học viên</p>
                            <p>₫ {course.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileInstructorPage;
