import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../../redux/action/courseActions';

import styles from './BrowseCoursePage.module.scss';

const BrowseCoursePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courses, loading, error } = useSelector(state => state.course);
    const profileComplete = useSelector(state => state.auth.profileComplete); // Thêm dòng này để lấy profileComplete từ Redux

    // const { courses, loading, error } = useSelector(state => state.courses);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {

            navigate('/login');

        } else {
            dispatch(fetchCourses());
        }
    }, [isLoggedIn, navigate, dispatch]);


    const handleDescriptionClick = (courseId) => {
        navigate(`/course/${courseId}`); // Replace this with your actual route
    };
    // console.log(courses.map(course => course.img)); 

    return (

        <div className={styles.homePageContent}>
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
            <div className={styles.course}>
                {loading ? (
                    <div>Loading courses...</div>
                ) : error ? (
                    <div>Error fetching courses: {error.message}</div>
                ) : courses ? (
                    <div className={styles.courseGrid}>
                        {courses.map(course => (
                            <div key={course._id} className={styles.courseCard}>
                                <img src={course.img} alt={course.name} />
                                <div className={styles.courseInfo}>
                                    <h3>{course.name}</h3>
                                    <p>{course.description}</p>
                                    <button>Add to Cart</button>
                                    <button onClick={() => handleDescriptionClick(course._id)}>Description</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
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
