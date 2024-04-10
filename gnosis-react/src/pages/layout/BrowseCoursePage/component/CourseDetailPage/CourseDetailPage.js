import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { fetchCourseDetail } from '../../../../../redux/action/courseActions';

import styles from './CourseDetailPage.module.scss'; // Đảm bảo bạn đã tạo file SCSS này

const CourseDetailPage = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const { courseDetail, loading, error } = useSelector((state) => state.courseDetail);


    useEffect(() => {
        dispatch(fetchCourseDetail(courseId));
    }, [dispatch, courseId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <div className={styles.courseDetailPage}>
            <div className={styles.breadcrumbs}>Home &gt; Browse&gt; Detail course</div>
            <div className={styles.courseDetailContainer}>


                <div className={styles.courseImageSection}>
                    <div className={styles.imageWrapper}>
                        <img src={courseDetail.img} alt={courseDetail.name} />
                    </div>
                </div>
                <div className={styles.courseInfoSection}>
                    <h1 className={styles.courseTitle}>{courseDetail.name}</h1>
                    <div className={styles.courseMetadata}>
                        <span className={styles.courseLanguage}>{courseDetail.language}</span>
                        <span className={styles.courseRating}>
                            {Array.from({ length: courseDetail.rating }, (_, i) => (
                                <span key={i}>⭐</span>
                            ))}
                        </span>
                        <span className={styles.coursePrice}>${courseDetail.price}</span>
                    </div>
                    <button className={styles.addToCartButton}>Add to Cart</button>
                    <div className={styles.courseDescription}>
                        <h2>Description</h2>
                        <p>{courseDetail.description}</p>
                    </div>
                    {/* Bạn có thể thêm thêm các phần khác tùy thuộc vào dữ liệu của bạn */}
                </div>
            </div>
            <div className={styles.courseDetailSkills}>
                <div className={styles.skillSection}>
                    <h3>Skills</h3>
                    <ul>
                        <li>Speaking Skill</li>
                        <li>Writing Skill</li>
                        <li>Reading Skill</li>
                        <li>Vocabulary and Grammar</li>
                    </ul>
                </div>
                <div className={styles.certificateSection}>
                    <h3>Certificate</h3>
                    {/* Thông tin về certificate */}
                    <p>Certificate of completion of the course at Gnosis</p>
                </div>
            </div>
        </div>
    );
};
export default CourseDetailPage;
