import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProfile } from '../../../redux/action/profileActions'; // Chỉnh lại đường dẫn nếu cần
import styles from './ProfileInstructorPage.module.scss'; // Tạo file SCSS nếu cần

const ProfileInstructorPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector(state => state.profile || {});

    useEffect(() => {
        if (id) {
            dispatch(fetchProfile(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>Có lỗi xảy ra: {error}</div>;
    }

    // Data tĩnh cho các phần khác
    const staticData = {
        averageRating: 4.5,
        totalStudents: 1500,
        totalCourses: 10,
        totalReviews: 200,
        courses: [
            { id: 1, title: "Khóa học A", description: "Mô tả khóa học A", image: "https://via.placeholder.com/150" },
            { id: 2, title: "Khóa học B", description: "Mô tả khóa học B", image: "https://via.placeholder.com/150" },
            // Thêm các khóa học khác nếu cần
        ],
        reviews: [
            { id: 1, content: "Đánh giá A", reviewerName: "Người dùng A", rating: 5 },
            { id: 2, content: "Đánh giá B", reviewerName: "Người dùng B", rating: 4 },
            // Thêm các đánh giá khác nếu cần
        ]
    };

    return (
        <div className={styles.profileInstructorPage}>
            <div className={styles.profileHeader}>
                <h1>Thông tin giảng viên</h1>
                {profile ? (
                    <div className={styles.profileInfo}>
                        <h2>{profile.name}</h2>
                        <p>Email: {profile.email}</p>
                        <p>Bio: {profile.bio}</p>
                        <p>Country : {profile.country}</p>
                        <div className={styles.profileStats}>
                            <div>Rating trung bình: {staticData.averageRating}</div>
                            <div>Số học viên: {staticData.totalStudents}</div>
                            <div>Số khóa học: {staticData.totalCourses}</div>
                            <div>Số đánh giá: {staticData.totalReviews}</div>
                        </div>
                    </div>
                ) : (
                    <div>Không tìm thấy thông tin giảng viên.</div>
                )}
            </div>

            <div className={styles.coursesSection}>
                <h2>Các khóa học của giảng viên</h2>
                <div className={styles.coursesGrid}>
                    {staticData.courses.map(course => (
                        <div key={course.id} className={styles.courseCard}>
                            <img src={course.image} alt={course.title} className={styles.courseImage} />
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.reviewsSection}>
                <h2>Một số đánh giá tiêu biểu</h2>
                <div className={styles.reviewsGrid}>
                    {staticData.reviews.map(review => (
                        <div key={review.id} className={styles.reviewCard}>
                            <p className={styles.reviewContent}>"{review.content}"</p>
                            <div className={styles.reviewInfo}>
                                <span className={styles.reviewerName}>{review.reviewerName}</span>
                                <span className={styles.reviewRating}>Rating: {review.rating}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileInstructorPage;
