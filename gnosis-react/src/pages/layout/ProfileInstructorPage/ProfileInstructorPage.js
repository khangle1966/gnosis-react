import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProfile } from '../../../redux/action/profileActions'; // Chỉnh lại đường dẫn nếu cần
import styles from './ProfileInstructorPage.module.scss'; // Tạo file SCSS nếu cần

const ProfileInstructorPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector(state => state.profile || {});
    const [showMoreProfile, setShowMoreProfile] = useState(false);

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
        totalStudents: 4187,
        totalReviews: 806,
        courses: [
            { id: 1, title: "React Ultimate - React.JS Cơ Bản Từ Z Đến A Cho Beginners", rating: 4.2, reviews: 260, duration: "19.5 giờ", lessons: 119, level: "Tất cả trình độ", price: "699.000", image: "https://via.placeholder.com/150" },
            { id: 2, title: "Kỹ Thuật Debugs Với Lập Trình FullStack Website", rating: 5.0, reviews: 27, duration: "3.5 giờ", lessons: 45, level: "Tất cả trình độ", price: "399.000", image: "https://via.placeholder.com/150" },
            { id: 3, title: "Git Siêu Căn Bản Cho Người Mới Bắt Đầu Từ Z Đến A", rating: 5.0, reviews: 95, duration: "5.0 giờ", lessons: 60, level: "Tất cả trình độ", price: "499.000", image: "https://via.placeholder.com/150" },
            { id: 4, title: "React State Manager - Redux Toolkit, React Query, Redux Saga", rating: 5.0, reviews: 119, duration: "10 giờ", lessons: 85, level: "Tất cả trình độ", price: "599.000", image: "https://via.placeholder.com/150" },
            // Thêm các khóa học khác nếu cần
        ],
        reviews: [
            { id: 1, content: "Đánh giá A", reviewerName: "Người dùng A", rating: 5 },
            { id: 2, content: "Đánh giá B", reviewerName: "Người dùng B", rating: 4 },
            // Thêm các đánh giá khác nếu cần
        ]
    };

    const toggleShowMoreProfile = () => {
        setShowMoreProfile(!showMoreProfile);
    };

    const profileContent = `
        Minh tên là Eric, người sáng lập kênh Youtube "Hỏi Dân IT", cựu sinh viên CNTT trường đại học Bách Khoa Hà Nội, và đang là một "thằng DEV" tại một ngân hàng (nào đó) ở Hà Nội.
        Trước khi đầu quân cho ngân hàng, thì mình cũng có thời gian gần 2 năm làm việc cho công ty chứng khoán, và công việc chủ yếu của mình làm việc với React và Node.JS.
        Dù đi đến đâu, làm việc ở công ty nào, thì mình cũng là fullstack developer, và luôn sử dụng React ở Frontend (backend có thể là java, php hoặc javascript).
        Youtube channel: Hỏi Dân IT
        Tech Skills:
        - Frontend: ReactJS, Angular và Vue.
        - Backend: Javascript với Node.js, Laravel và Spring Boots.
        Ngoài ra còn nhiều skills hơn nữa (ví dụ như biết tý chút Docker, làm về Devops...) cơ mà mình không thích khoe :v
        Các bạn sẽ học được từ mình, những gì mình đã "tự học" từ thời sinh viên cho tới khi đi làm.
        Tin mình đi. Vì mình đã tốt nghiệp bằng Kỹ sư Bách Khoa không dễ - Vì nơi đây, thật sự là thi thật.
    `;

    return (
        <div className={styles.profileInstructorPage}>
            <div className={styles.profileHeader}>
                <div className={styles.profileImage}>
                    <img src="https://via.placeholder.com/150" alt="Instructor" />
                </div>
                <div className={styles.profileInfo}>
                    <h1>Hỏi Dân IT với Eric</h1>
                    <p>Ghét Code và Chỉ Biết Google - "Beyond Your Coding Skills"</p>
                    <div className={styles.profileStats}>
                        <div>Tổng học viên :</div>
                        <div className={styles.statNumber}>{staticData.totalStudents}</div>
                        <div>Đánh giá :</div>
                        <div className={styles.statNumber}>{staticData.totalReviews}</div>
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
                <p className={styles.profileDescription}>
                    {showMoreProfile ? profileContent : `${profileContent.substring(0, 900)}...`}
                </p>
                {profileContent.length > 900 && (
                    <button onClick={toggleShowMoreProfile} className={styles.toggleButton}>
                        {showMoreProfile ? 'Ẩn bớt' : 'Hiển thị tất cả'}
                    </button>
                )}
            </div>

            <div className={styles.coursesSection}>
                <h2>Các khóa học của tôi ({staticData.courses.length})</h2>
                <div className={styles.coursesGrid}>
                    {staticData.courses.map(course => (
                        <div key={course.id} className={styles.courseCard}>
                            <img src={course.image} alt={course.title} className={styles.courseImage} />
                            <h3>{course.title}</h3>
                            <p>Hỏi Dân IT với Eric</p>
                            <p>{course.rating} <span className={styles.stars}>★</span> ({course.reviews})</p>
                            <p>Tổng số {course.duration} • {course.lessons} bài giảng • {course.level}</p>
                            <p>₫ {course.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileInstructorPage;
