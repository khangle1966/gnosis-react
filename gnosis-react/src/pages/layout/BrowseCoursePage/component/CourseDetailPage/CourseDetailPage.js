import React, { useState, useEffect } from 'react';
import styles from './CourseDetailPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessonsByCourseId, fetchLessonsBychapterId } from '../../../../../redux/action/lessonActions';
import { fetchChaptersByCourseId } from '../../../../../redux/action/chapterActions';
import renderStars from './renderStars';
import { fetchCourseDetail } from '../../../../../redux/action/courseActions';
import { useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'; // Import Tooltip from react-tooltip


export const CourseDetailPage = () => {
    const { courseId, chapterId } = useParams();
    const dispatch = useDispatch();
    const { courseDetail, loading: loadingCourse, error: errorCourse } = useSelector(state => state.courseDetail);
    const { lessons, loading: loadingLessons, error: errorLessons } = useSelector(state => state.lessonDetail);
    const { chapters, loadingChapters, errorChapters } = useSelector(state => state.chapterDetail);
    const { rating } = courseDetail;

    const [groupedChapters, setGroupedChapters] = useState([]);
    const [openChapters, setOpenChapters] = useState([]);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetail(courseId));
            dispatch(fetchLessonsByCourseId(courseId));
            dispatch(fetchChaptersByCourseId(courseId));
            if (chapterId) {
                dispatch(fetchLessonsBychapterId(chapterId));
            }
        }
    }, [dispatch, courseId, chapterId]);

    useEffect(() => {
        if (chapters.length > 0 && lessons.length > 0) {
            const sortedChapters = chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
            const chaptersMap = sortedChapters.reduce((acc, chapter) => {
                acc[chapter._id] = {
                    title: `Chapter ${chapter.chapterNumber}: ${chapter.title}`,
                    lessons: [],
                    _id: chapter._id
                };
                return acc;
            }, {});

            lessons.forEach(lesson => {
                if (chaptersMap[lesson.chapterId]) {
                    chaptersMap[lesson.chapterId].lessons.push(lesson);
                }
            });

            setGroupedChapters(Object.values(chaptersMap));
        }
    }, [lessons, chapters]);

    if (loadingCourse || loadingLessons || loadingChapters) return <div>Đang tải...</div>;
    if (errorCourse || errorLessons || errorChapters) return <div>Lỗi: {errorCourse || errorLessons || errorChapters}</div>;

    const handleToggleChapter = (chapterId) => {
        setOpenChapters(prev => {
            const isOpen = prev.includes(chapterId);
            return isOpen ? prev.filter(id => id !== chapterId) : [...prev, chapterId];
        });
    };

    const handleToggleAllChapters = () => {
        const anyChapterClosed = groupedChapters.some(chapter => !openChapters.includes(chapter._id));
        setOpenChapters(anyChapterClosed ? groupedChapters.map(chapter => chapter._id) : []);
    };

    // Static data structure for demonstration




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
                    <div className={styles.breadcrumbs}>Home &gt; Browse Course &gt; {courseDetail.name} </div>
                    <h1 className={styles.courseTitle}>{courseDetail.name}</h1>


                    <p className={styles.courseSubtitle}>{courseDetail.subTitle}</p>

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
                    {groupedChapters.map(chapter => (
                        <div key={chapter._id} className={styles.list}>
                            <div className={styles.item} onClick={() => handleToggleChapter(chapter._id)}>
                                <h4>


                                    <span>{chapter.title}</span> {/* Thêm text cho tooltip */}

                                </h4>
                                <div className={styles.duration}>{chapter.lessons.length} Bài</div>
                            </div>
                            {openChapters.includes(chapter._id) && (
                                <ul className={styles.sublist}>
                                    {chapter.lessons.map(lesson => (
                                        <li key={lesson._id} className={styles.lesson} data-tip={lesson.description}>
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

export default CourseDetailPage;
