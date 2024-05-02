import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../../redux/action/courseActions';
import { addToCart } from '../../../redux/action/cartActions'; // Đảm bảo rằng import này chính xác

import styles from './BrowseCoursePage.module.scss';

const BrowseCoursePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courses, loading, error } = useSelector(state => state.course);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const [notification, setNotification] = useState({ show: false, message: '' });

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            dispatch(fetchCourses());
        }
    }, [isLoggedIn, navigate, dispatch]);
    const handleAddToCart = (course) => {
        dispatch(addToCart(course));
        // Show the notification
        setNotification({ show: true, message: `Added "${course.name}" to cart.` });
        // Hide the notification after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, message: '' });
        }, 3000);
    };
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


    return (
        <div className={styles.homePageContent}>
            {notification.show && (
                <div className={styles.notification}>
                    {notification.message}
                </div>
            )}
            <div className={styles.breadcrumbs}>Home &gt; Browse</div>
            <div className={styles.promotions}>
                {/* Placeholder for promotions */}
                <span>70% off all courses today</span>
                <span>70% off all courses today</span>
                <span>70% off all courses today</span>
            </div>
            <div className={styles.filterBar}>
                {/* Placeholder for filter buttons */}
                <button>All</button>
                <button>Popular</button>
                <button>Web Developer</button>
                <button>Computer Science</button>
                <button>English</button>
                <button>Music</button>
                <button>Cook</button>
            </div>
            <div className={styles.courseGrid}>
                {loading && <div>Loading courses...</div>}
                {error && <div>Error fetching courses: {error.message}</div>}
                {courses && courses.map((course) => (
                    <div key={course._id} className={styles.courseCard}>
                        <div className={styles.courseImageWrapper}>
                            <img src={course.img} alt={course.name} />
                        </div>
                        <div className={styles.courseDetails}>
                            <h3>{truncateNameCourse(course.name)}</h3>
                            <p>{truncateDescription(course.description || '')}</p>


                            <div className={styles.courseActions}>
                                <button onClick={() => handleAddToCart(course)}>Add to Cart</button>

                                <button onClick={() => handleDescriptionClick(course._id)}>Description</button>
                                {/* Thêm nút "Cancel" nếu cần */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.pagination}>
                {/* Placeholder for pagination */}
                <button>&lt;</button>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <button>&gt;</button>
            </div>
        </div>
    );
};

export default BrowseCoursePage;
