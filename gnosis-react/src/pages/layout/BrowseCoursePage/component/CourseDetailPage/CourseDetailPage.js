import React, { useState, useEffect } from 'react';
import styles from './CourseDetailPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessonsByCourseId } from '../../../../../redux/action/lessonActions';
import renderStars from './renderStars'; // Giả sử bạn đã export hàm này từ file khác
import { fetchCourseDetail } from '../../../../../redux/action/courseActions';
import { useParams } from 'react-router-dom';

export const CourseDetailPage = () => {
    const { courseId } = useParams();  // Using useParams to get the course id
    const dispatch = useDispatch();
    const { courseDetail, loading: loadingCourse, error: errorCourse } = useSelector(state => state.courseDetail);
    const { lessons, loading: loadingLessons, error: errorLessons } = useSelector(state => state.lessonDetail);
    const { rating } = courseDetail; // Đảm bảo rằng courseDetail có chứa trường rating



    const [openChapters, setOpenChapters] = useState([]);
    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetail(courseId)); // Dispatch action để lấy thông tin chi tiết khóa học
            dispatch(fetchLessonsByCourseId(courseId)); // Dispatch action để lấy danh sách bài học của khóa học
        }
    }, [dispatch, courseId]);
    console.log("Course detail data:", courseDetail);
    if (loadingCourse || loadingLessons) return <div>Đang tải...</div>;
    if (errorCourse || errorLessons) return <div>Lỗi: {errorCourse || errorLessons}</div>;

    const handleToggleChapter = (index) => {
        setOpenChapters((prevOpenChapters) => {
            // Kiểm tra xem chương đã mở hay chưa
            const isOpen = prevOpenChapters.includes(index);
            // Nếu chưa mở, thêm chương vào mảng, nếu đã mở thì loại bỏ khỏi mảng
            return isOpen ? prevOpenChapters.filter((item) => item !== index) : [...prevOpenChapters, index];
        });
    };


    // Static data structure for demonstration


    const chapters = groupLessonsByChapter(lessons);

    const totalChapters = chapters.length; // Tổng số chương dựa vào số lượng chương nhóm được
    const totalLessons = chapters.reduce((total, chapter) => total + chapter.lessons.length, 0); // Tổng số bài học

    // Tổng thời lượng bằng giây
    const totalDurationSeconds = chapters.reduce((total, chapter) => {
        return total + chapter.lessons.reduce((chapterTotal, lesson) => {
            // Chuyển đổi thời lượng từ giờ sang giây
            return chapterTotal + lesson.duration * 3600; // Giả sử duration là giờ
        }, 0);
    }, 0);

    // Chuyển tổng thời lượng từ giây sang giờ và phút
    const totalHours = Math.floor(totalDurationSeconds / 3600);
    const totalMinutes = Math.floor((totalDurationSeconds % 3600) / 60);
    const handleToggleAllChapters = () => {
        const anyChapterClosed = chapters.some((_, index) => !openChapters.includes(index));

        if (anyChapterClosed) {
            setOpenChapters(chapters.map((_, index) => index));
        } else {
            // Empty the openChapters array to close all
            setOpenChapters([]);
        }
    };


    return (
        <>
            <nav className={styles.navbar}>
                {/* You can add your logo, navigation links or any other content here */}
                <h1 className={styles.courseTitle}>{courseDetail.name}</h1>

                {/* Add additional nav items here if needed */}
            </nav>
            <div className={styles.courseSidebar}>
                <div className={styles.coursePreview}>
                    {/* Assume you have a thumbnail image or video here */}

                    {courseDetail.img && <img src={courseDetail.img} alt="Hình ảnh khóa học" className={styles.courseImage} />}
                </div>
                <div className={styles.coursePurchase}>
                    <div className={styles.coursePrice}>${courseDetail.price}</div>
                    <button className={styles.addToCartButton}>Thêm vào giỏ hàng</button>
                    <button className={styles.buyNowButton}>Mua ngay</button>
                    <div className={styles.moneyBackGuarantee}>Đảm bảo hoàn tiền trong 30 ngày</div>
                </div>
                <div className={styles.courseIncludes}>
                    <h4>Khóa học này bao gồm:</h4>
                    <ul>
                        <li>12,5 giờ video theo yêu cầu</li>
                        <li>4 bài viết</li>
                        <li>Truy cập không giới hạn trên thiết bị di động và TV</li>
                        <li>Quyền truy cập đầy đủ suốt đời</li>
                        <li>Giấy chứng nhận hoàn thành</li>
                    </ul>
                </div>
                {/* Additional sections like "Share", "Gift this course", "Apply coupon" can be added here */}
            </div>

            <div className={styles.courseDetailContainer}>

                <div className={styles.courseHeader}>
                    <div className={styles.breadcrumbs}>Browse Course &gt; {courseDetail.name} </div>
                    <h1 className={styles.courseTitle}>{courseDetail.name}</h1>


                    <p className={styles.courseSubtitle}>{courseDetail.subtitle}</p>
                    <div className={styles.courseRating}>
                        <span className={styles.rating}>({courseDetail.rating})</span>


                        {renderStars(rating)}


                        <span>(110 xếp hạng)</span>
                        <span className={styles.enrollment}>528 học viên</span>
                    </div>
                    <div className={styles.instructorInfo}>
                        Được tạo bởi <a href='/default' > {courseDetail.author} </a>
                        <span className={styles.updateDate}>Lần cập nhật gần đây nhất 11/2023</span>
                        <span className={styles.language}>{courseDetail.language}</span>
                    </div>
                </div>

                <div className={styles.courseContent2}>
                    <h2>Nội dung bài học</h2>
                    {/* Static data for demonstration */}



                    <div className={styles.item}>
                        <div className={styles.title}>{courseDetail.description}</div>

                    </div>




                </div>
                <div className={styles.courseContentOverview}>
                    <h2>Nội dung khóa học</h2>
                    <span>{totalChapters} phần · {totalLessons} bài giảng · {totalHours} giờ {totalMinutes} phút tổng thời lượng</span>
                    <button onClick={handleToggleAllChapters}>Mở rộng/tắt tất cả các chương</button>
                </div>
                <div className={styles.courseContent}>
                    {chapters.map((chapter, index) => (
                        <div key={index} className={styles.list}>
                            <div className={styles.item} onClick={() => handleToggleChapter(index)}>
                                <div className={styles.title}>{chapter.title} </div>
                                <div className={styles.duration}>{chapter.lessons.length} Bài</div>
                            </div>
                            {openChapters.includes(index) && (
                                <ul className={styles.sublist}>
                                    {chapter.lessons.map((lesson, lessonIndex) => (
                                        <li key={lessonIndex} className={styles.lesson}>
                                            <span className={styles.lessonTitle}>{lesson.title}</span>
                                            <span className={styles.lessonDuration}>{lesson.duration}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.requirements}>
                    <h3>Yêu cầu</h3>
                    <ul>
                        <li>{courseDetail.request}</li>
                    </ul>
                </div>

                <div className={styles.description}>
                    <h3>Mô tả</h3>
                    <p>{courseDetail.describe}</p>

                    {/* ...tiếp tục thêm toàn bộ nội dung mô tả từ hình ảnh... */}
                </div>

            </div>
        </>
    );
};
function groupLessonsByChapter(lessons) {
    const chaptersMap = {};

    lessons.forEach((lesson) => {
        const chapterNumber = lesson.chapterNumber; // Trường xác định chương
        if (!chaptersMap[chapterNumber]) {
            chaptersMap[chapterNumber] = {
                title: `Chapter ${chapterNumber}`, // Tiêu đề chương
                lessons: []
            };
        }
        chaptersMap[chapterNumber].lessons.push(lesson);
    });

    // Chuyển đổi từ object sang mảng chương
    return Object.keys(chaptersMap).map((chapterNumber) => {
        return {
            ...chaptersMap[chapterNumber],
            chapterNumber
        };
    });
}

export default CourseDetailPage;
