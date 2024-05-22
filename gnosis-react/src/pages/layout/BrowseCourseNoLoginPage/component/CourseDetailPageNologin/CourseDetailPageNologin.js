import React, { useEffect, useState, useMemo } from 'react';
import styles from './CourseDetailPageNologin.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessonsByCourseId, fetchLessonsBychapterId } from '../../../../../redux/action/lessonActions';
import { fetchChaptersByCourseId } from '../../../../../redux/action/chapterActions';
import renderStars from './renderStars';
import { fetchCourseDetail } from '../../../../../redux/action/courseActions';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCart } from '../../../../../redux/action/cartActions';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const CourseDetailPageNologin = () => {
    const { courseId, chapterId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courseDetail, loading: loadingCourse, error: errorCourse } = useSelector(state => state.courseDetail);
    const { lessons, loading: loadingLessons, error: errorLessons } = useSelector(state => state.lessonDetail);
    const { chapters, loadingChapters, errorChapters } = useSelector(state => state.chapterDetail || { chapters: [] });

    const { rating } = courseDetail;

    const [newLesson, setNewLesson] = useState({ title: '', description: '', duration: 0, courseId: courseId });
    const [showModal, setShowModal] = useState(false);

    const [groupedChapters, setGroupedChapters] = useState([]);
    const [openChapters, setOpenChapters] = useState([]);

    const [editableCourse, setEditableCourse] = useState({ ...courseDetail });

    useEffect(() => {
        const totalChapters = groupedChapters.length;
        const totalLessons = groupedChapters.reduce((total, chapter) => total + (Array.isArray(chapter.lessons) ? chapter.lessons.length : 0), 0);
        console.log("Total chapters:", totalChapters, "Total lessons:", totalLessons);
    }, [groupedChapters]);

    const [selectedChapterId, setSelectedChapterId] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const { totalChapters, totalLessons, formattedDuration } = useMemo(() => {
        const totalChapters = groupedChapters.length;
        const totalLessons = groupedChapters.reduce((total, chapter) => {
            return total + (Array.isArray(chapter.lessons) ? chapter.lessons.length : 0);
        }, 0);

        const totalDurationSeconds = groupedChapters.reduce((total, chapter) => {
            return total + (Array.isArray(chapter.lessons) ? chapter.lessons.reduce((chapterTotal, lesson) => {
                return chapterTotal + ((typeof lesson.duration === 'number') ? lesson.duration : 0);
            }, 0) : 0);
        }, 0);

        const hours = Math.floor(totalDurationSeconds / 3600);
        const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
        const seconds = Math.floor((totalDurationSeconds % 60));
        const formattedDuration = `${hours} giờ ${minutes} phút ${seconds} giây`;

        return { totalChapters, totalLessons, formattedDuration };
    }, [groupedChapters]);

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
        setEditableCourse({ ...courseDetail });
    }, [courseDetail]);

    useEffect(() => {
        if (!chapters || !Array.isArray(chapters)) return;

        const sortedChapters = [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);
        const chaptersMap = sortedChapters.reduce((acc, chapter) => {
            acc[chapter._id] = {
                title: `${chapter.title}`,
                lessons: [],
                _id: chapter._id
            };
            return acc;
        }, {});

        if (lessons && lessons.length > 0) {
            lessons.forEach(lesson => {
                if (chaptersMap[lesson.chapterId]) {
                    chaptersMap[lesson.chapterId].lessons.push(lesson);
                }
            });
        }

        setGroupedChapters(Object.values(chaptersMap));
    }, [lessons, chapters]);

    console.log('Grouped Chapters:', groupedChapters);

    const formatDurationFromSeconds = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.round((seconds % 60));

        let formattedDuration = '';
        if (hours > 0) {
            formattedDuration += `${hours} giờ `;
        }
        formattedDuration += `${minutes} phút ${remainingSeconds} giây`;

        return formattedDuration;
    };

    const handleAddToCart = () => {
        navigate("/login")

    };

    const handleBuyCourse = (course) => {
        console.log("Purchasing course:", course.name);
    };

    if (loadingCourse || loadingLessons || loadingChapters) {
        return <div>Đang tải...</div>;
    }

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

    return (
        <>
            <nav className={styles.navbar}>
                <h1 className={styles.courseTitle}>{courseDetail.name}</h1>
            </nav>
            <div className={styles.courseSidebar}>
                <div className={styles.coursePreview}>
                    {courseDetail.img && <img src={courseDetail.img} alt="Hình ảnh khóa học" className={styles.courseImage} />}
                </div>
                <div className={styles.coursePurchase}>
                    <button className={styles.addToCartButton} onClick={handleAddToCart}>Login to Buy</button>
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
            </div>
            <div className={styles.courseDetailContainer}>
                <div className={styles.courseHeader}>
                    <div className={styles.breadcrumbs}>Home &gt; Browse Course &gt; {courseDetail.name} </div>
                    <h1 className={styles.courseTitle}>{courseDetail.name}</h1>
                    <p className={styles.courseSubtitle}>{courseDetail.subTitle}</p>
                    <div className={styles.courseRating}>
                        <span className={styles.rating}>({courseDetail.rating.toFixed(1)})</span>
                        {renderStars(courseDetail.rating)}
                        <span>({courseDetail.numberOfReviews} xếp hạng)</span>
                        <span className={styles.enrollment}>{courseDetail.numberOfStudents} học viên</span>
                    </div>
                    <div className={styles.instructorInfo}>
                        Được tạo bởi <a href='/default' > {courseDetail.author} </a>
                        <span className={styles.updateDate}>Lần cập nhật gần đây nhất {formatDate(courseDetail.updatedAt)}</span>
                        <span className={styles.language}>{courseDetail.language}</span>
                    </div>
                </div>
                <div className={styles.courseContent2}>
                    <h2>Nội dung bài học</h2>
                    <div className={styles.item}>
                        <div className={styles.description} dangerouslySetInnerHTML={{ __html: courseDetail.description }} />
                    </div>
                </div>
                <div className={styles.courseContentOverview}>
                    <h2>Nội dung khóa học</h2>
                    <span>{totalChapters} phần · {totalLessons} bài giảng · {formattedDuration} tổng thời lượng</span>
                    <button onClick={handleToggleAllChapters}>Mở rộng/tắt tất cả các chương</button>
                </div>
                <div className={styles.courseContent}>
                    {groupedChapters.map((chapter) => (
                        <div key={chapter._id} className={styles.list}>
                            <div className={styles.item} onClick={() => handleToggleChapter(chapter._id)}>
                                <div>
                                    <h4>{chapter.title}</h4>
                                </div>
                                <div className={styles.duration}>{chapter.lessons.length} Bài</div>
                            </div>
                            {openChapters.includes(chapter._id) && (
                                <ul className={styles.sublist}>
                                    {chapter.lessons.map(lesson => (
                                        <li key={lesson._id} className={styles.lesson} data-tip={lesson.description} >
                                            <span className={styles.lessonTitle}>{lesson.title}</span>
                                            <span className={styles.lessonDuration}>{formatDurationFromSeconds(lesson.duration)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.requirements}>
                    <h3>Yêu cầu</h3>
                    <div dangerouslySetInnerHTML={{ __html: courseDetail.request }} />
                </div>
                <div className={styles.description}>
                    <h3>Mô tả</h3>
                    <div dangerouslySetInnerHTML={{ __html: courseDetail.describe }} />
                </div>
            </div>
        </>
    );
};

export default CourseDetailPageNologin;
