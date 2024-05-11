import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoUrl } from '../../../../../redux/action/uploadActions';
import styles from './LessonPage.module.scss';
import { faArrowLeft, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown, faChevronUp, faCircle } from '@fortawesome/free-solid-svg-icons';
import { fetchLessonsByCourseId } from '../../../../../redux/action/lessonActions';
import { fetchChaptersByCourseId } from '../../../../../redux/action/chapterActions';
import { fetchCourseDetail } from '../../../../../redux/action/courseActions';
import { completeLesson } from '../../../../../redux/action/lessonCompleteActions';
import { fetchLessonComplete } from '../../../../../redux/action/lessonCompleteActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const LessonPage = () => {
    const { lessonId } = useParams(); // Lấy lessonId từ URL
    const { courseId } = useParams(); // Giả sử bạn lấy courseId từ URL
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState({});
    const { videoURL, loading, error } = useSelector(state => state.uploadVideo);
    const { courseDetail } = useSelector(state => state.courseDetail);
    const { user } = useSelector(state => state.auth);
    const userId = user.uid; // Nên được thay thế bằng cách lấy ID người dùng hiện tại từ trạng thái auth hoặc session

    const { chapters, } = useSelector(state => state.chapterDetail);
    const { lessons } = useSelector(state => state.lessonDetail);
    const { lessonscomplete } = useSelector(state => state.lessonComplete);

    console.log(lessonscomplete);
    console.log(chapters);
    console.log(lessons);

    useEffect(() => {
        dispatch(fetchVideoUrl(lessonId));
        dispatch(fetchChaptersByCourseId(courseId));
        dispatch(fetchLessonsByCourseId(courseId));
        dispatch(fetchCourseDetail(courseId));

        dispatch(fetchLessonComplete(userId));

    }, [dispatch, courseId, userId, lessonId]);


    const formatDurationFromSeconds = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.round(seconds % 60);

        let formattedDuration = '';


        if (hours > 0) {
            formattedDuration += `${hours}:`;
        }

        formattedDuration += `${minutes}:${remainingSeconds}`;

        return formattedDuration;
    };

    const getTotalAndCompletedLessons = () => {
        const total = lessons.length;
        const completed = lessonscomplete.length; // assuming this contains IDs of completed lessons
        return { total, completed };
    };
    const { total, completed } = getTotalAndCompletedLessons();

    const getChapterDetails = (chapter) => {
        const chapterLessons = lessons.filter(lesson => lesson.chapterId === chapter._id);
        const completedLessons = chapterLessons.filter(lesson => lessonscomplete.includes(lesson._id)).length;
        const totalDuration = chapterLessons.reduce((sum, lesson) => sum + lesson.duration, 0);
        return {
            completed: `${completedLessons}/${chapterLessons.length}`,
            duration: formatDurationFromSeconds(totalDuration)
        };
    };


    const handleLessonClick = (lessonId) => {
        dispatch(fetchVideoUrl(lessonId));
        navigate(`/course/${courseId}/lesson/${lessonId}`);
    };
    const handleBackclick = (courseId) => {

        navigate(`/course/${courseId}`);
    };

    const toggleExpand = chapterId => {
        setExpanded(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };
    const handleVideoEnded = () => {
        const userId = user.uid;
        // Đảm bảo rằng lessonId được lấy đúng kiểu và định dạng, và là duy nhất trong lessonscomplete
        if (!lessonscomplete.map(lesson => lesson.lessonId).includes(lessonId)) {
            dispatch(completeLesson(lessonId, userId));
        }
    };


    return (
        <div className={styles.container}>
            <header className={styles.header}>

                <div className={styles.leftNav}>
                    <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={() => handleBackclick(courseId)} />
                    <span>{courseDetail.name}</span>
                </div>
                <div className={styles.right}>
                    <div className={styles.progressContainer}>
                        <div className={styles.progressCircle}>
                            <span className={styles.progressPercentage}>{Math.round((completed / total) * 100)}%</span>
                        </div>
                        <span className={styles.lessonCount}>{completed}/{total} bài học</span>
                    </div>

                    <div className={styles.rightNav}>


                        <FontAwesomeIcon icon={faStickyNote} className={styles.noteIcon} />
                        Ghi chú
                    </div>
                </div>
            </header>
            <div className={styles.main}>
                <div className={styles.videoContainer}>
                    {loading && <div className={styles.loading}>Loading...</div>}
                    {error && <div className={styles.error}>Error: {error}</div>}
                    {videoURL && <ReactPlayer
                        url={videoURL}
                        controls={true}
                        width="100%"
                        height="100%"
                        className={styles.reactPlayer}
                        onEnded={handleVideoEnded}
                    />}
                </div>


                <aside className={styles.videoList}>
                    <div className={styles.courseContentHeader}>Nội dung khóa học</div>  {/* Tiêu đề mới */}

                    <ul>
                        {chapters.map(chapter => (
                            <li key={chapter._id}>
                                <div className={styles.chapterHeader} onClick={() => toggleExpand(chapter._id)}>
                                    <div className={styles.iconntittle}>

                                        <span>{chapter.title}</span>
                                        <FontAwesomeIcon icon={expanded[chapter._id] ? faChevronUp : faChevronDown} />
                                    </div>

                                    <div className={styles.chapterDetails}>
                                        <span className={styles.goingcourse}>{getChapterDetails(chapter).completed}</span>
                                        <span className={styles.divider}>|</span>  {/* Dấu gạch đứng ngăn cách */}

                                        <span className={styles.durationchapter}>{getChapterDetails(chapter).duration}</span>
                                    </div>


                                </div>
                                {expanded[chapter._id] && (
                                    <ul className={styles.lessonList}>
                                        {lessons.filter(lesson => lesson.chapterId === chapter._id).map(lesson => (
                                            <li key={lesson._id} className={styles.lessonItem} onClick={() => handleLessonClick(lesson._id)}
                                            >
                                                <FontAwesomeIcon icon={faCircle} className={styles.lessonIcon} />
                                                <span className={styles.lessonName}>{lesson.title}</span>
                                                <span className={styles.lessonDuration}>{formatDurationFromSeconds(lesson.duration)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>


            <footer className={styles.footer}>
                © 2024 GNOSIS. All Rights Reserved.
            </footer>
        </div>
    );
};

export default LessonPage;
