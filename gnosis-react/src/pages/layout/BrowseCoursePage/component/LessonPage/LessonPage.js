import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoUrl } from '../../../../../redux/action/uploadActions';
import styles from './LessonPage.module.scss';
import { faArrowLeft, faStickyNote, faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown, faChevronUp, faCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchLessonsByCourseId, fetchLessonById } from '../../../../../redux/action/lessonActions';
import { fetchChaptersByCourseId } from '../../../../../redux/action/chapterActions';
import { fetchCourseDetail, updateCourseRating } from '../../../../../redux/action/courseActions'; // import action
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons'; // Import social icons
import logo from '../../../../../assets/images/logo1.png';
import { completeLesson, fetchLessonComplete } from '../../../../../redux/action/lessonCompleteActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteModal from './components/NoteModal';
import NoteViewer from './components/NoteViewer';
import { fetchNotes } from '../../../../../redux/action/noteActions';
import { completeCourse, fetchProfile } from '../../../../../redux/action/profileActions';
import RatingModal from './components/RatingModal';
import { fetchRatingsByCourseId, submitRating } from '../../../../../redux/action/ratingActions';

export const LessonPage = () => {
    const { lessonId, courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState({});
    const { videoURL, loading, error } = useSelector(state => state.uploadVideo);
    const { courseDetail, loading: courseLoading, error: courseError } = useSelector(state => state.courseDetail);
    const { user } = useSelector(state => state.auth);
    const userId = user.uid;
    const [currentTime, setCurrentTime] = useState(0);
    const playerRef = useRef(null);
    const { chapters } = useSelector(state => state.chapterDetail);
    const { lessons } = useSelector(state => state.lessonDetail);
    const { lessonscomplete } = useSelector(state => state.lessonComplete);

    const [activeSection, setActiveSection] = useState('overview');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showNoteViewer, setShowNoteViewer] = useState(false);
    const [currentNote, setCurrentNote] = useState('');
    const [playing, setPlaying] = useState(true);
    const [timeToSeek, setTimeToSeek] = useState(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [key, setKey] = useState(0);
    const { lesson, loading: lessonLoading, error: lessonError } = useSelector(state => state.lessonDetail);
    const { notes, loading: loadingnotes, error: errornotes } = useSelector(state => state.notesData);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const { ratings } = useSelector(state => state.ratings);
    const [userNames, setUserNames] = useState({}); // State to store user names

    const getTotalAndCompletedLessons = () => {
        const total = lessons.length;
        const completed = lessonscomplete.length;
        return { total, completed };
    };
    const { total, completed } = getTotalAndCompletedLessons();

    useEffect(() => {
        console.log("useEffect triggered");
        console.log("completed: ", completed, "total: ", total);
        if (completed === total && total !== 0) {
            console.log("Dispatching completeCourse");
            dispatch(completeCourse(userId, courseId));
        } else {
            console.log("Condition not met for dispatching completeCourse");
        }
        dispatch(fetchVideoUrl(lessonId));
        dispatch(fetchChaptersByCourseId(courseId));
        dispatch(fetchLessonsByCourseId(courseId));
        dispatch(fetchCourseDetail(courseId));
        dispatch(fetchRatingsByCourseId(courseId));
        dispatch(fetchLessonComplete(courseId, userId));
        dispatch(fetchNotes(userId));
    }, [dispatch, courseId, userId, lessonId, completed, total]);

    useEffect(() => {
        if (lessonId) {
            dispatch(fetchLessonById(lessonId));
            setKey(prevKey => prevKey + 1);
        }
    }, [dispatch, lessonId]);

    useEffect(() => {
        // Fetch profiles for all rating users
        console.log("Ratings: ", ratings);
        ratings.forEach(rating => {
            if (!userNames[rating.userId]) {
                dispatch(fetchProfile(rating.userId)).then(profileData => {
                    console.log("Profile data fetched: ", profileData);
                    setUserNames(prevUserNames => ({
                        ...prevUserNames,
                        [rating.userId]: profileData.userName
                    }));
                });
            }
        });
    }, [ratings, dispatch]);

    const handleRatingSubmit = (ratingData) => {
        dispatch(submitRating(ratingData));
        dispatch(updateCourseRating(courseId, ratingData.rating)); // cập nhật số lượng đánh giá
        setShowRatingModal(false);
    };

    const calculateRatingBreakdown = (ratings) => {
        const totalRatings = ratings.length;
        const breakdown = [0, 0, 0, 0, 0];

        ratings.forEach((rating) => {
            breakdown[rating.rating - 1] += 1;
        });

        return breakdown.map((count) => Math.round((count / totalRatings) * 100));
    };

    const ratingBreakdown = calculateRatingBreakdown(ratings);

    if (!lesson) {
        return <div>Loading lesson...</div>;
    }
    if (lessonLoading || courseLoading) return <div>Loading...</div>;
    if (lessonError) return <div>Error: {lessonError}</div>;
    const currentLessonDescription = lessons.find(lesson => lesson._id === lessonId)?.description || "Loading lesson description...";

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

    const getChapterDetails = (chapter) => {
        const chapterLessons = lessons.filter(lesson => lesson.chapterId === chapter._id);
        const completedLessons = chapterLessons.filter(lesson => lessonscomplete.includes(lesson._id)).length;
        const totalDuration = chapterLessons.reduce((sum, lesson) => sum + lesson.duration, 0);
        return {
            completed: `${completedLessons}/${chapterLessons.length}`,
            duration: formatDurationFromSeconds(totalDuration)
        };
    };

    const handlePlayerReady = () => {
        setPlayerReady(true);
        if (timeToSeek !== null) {
            playerRef.current.seekTo(timeToSeek);
            setTimeToSeek(null);
        }
    };

    const handleProgress = (state) => {
        setCurrentTime(state.playedSeconds);
        if (timeToSeek !== null && playerReady) {
            playerRef.current.seekTo(timeToSeek);
            setTimeToSeek(null);
        }
    };

    const handleNoteClick = () => {
        setShowNoteModal(true);
        setPlaying(false);
    };

    const handleCloseModal = () => {
        setShowNoteModal(false);
        setPlaying(true);
    };

    const handleViewNotes = () => {
        setShowNoteViewer(true);
        setPlaying(false);
    };

    const handleCloseViewer = () => {
        setShowNoteViewer(false);
        setPlaying(true);
    };

    const handleSaveNote = (note) => {
        setShowNoteModal(false);
        dispatch(fetchNotes(userId));
    };

    const handleLessonClick = (lessonId) => {
        dispatch(fetchVideoUrl(lessonId));
        navigate(`/course/${courseId}/lesson/${lessonId}`);
    };

    const handleBackclick = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsRemaining = Math.floor(seconds % 60);
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = secondsRemaining.toString().padStart(2, '0');
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }

    const toggleExpand = chapterId => {
        setExpanded(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };

    const handleVideoEnded = () => {
        if (!lessonscomplete.includes(lessonId)) {
            dispatch(completeLesson(lessonId, userId, courseId));
        }
    };

    const handleRatingClick = () => {
        setShowRatingModal(true);
    };

    const handleRatingModalClose = () => {
        setShowRatingModal(false);
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {Array.from({ length: fullStars }).map((_, index) => (
                    <FontAwesomeIcon key={`full-${index}`} icon={faStar} className={styles.filledStar} />
                ))}
                {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className={styles.filledStar} />}
                {Array.from({ length: emptyStars }).map((_, index) => (
                    <FontAwesomeIcon key={`empty-${index}`} icon={faStar} className={styles.emptyStar} />
                ))}
            </>
        );
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.leftNav}>
                    <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={() => handleBackclick(courseId)} />
                    <span>{courseDetail.name}</span>
                </div>
                <div className={styles.right}>
                    <div className={styles.ratingContainer} onClick={handleRatingClick}>
                        <FontAwesomeIcon icon={faStar} className={styles.ratingIcon} />
                        Đưa ra xếp hạng
                    </div>
                    <div className={styles.progressContainer}>
                        <div className={styles.progressCircle}>
                            <span className={styles.progressPercentage}>{Math.round((completed / total) * 100)}%</span>
                        </div>
                        <span className={styles.lessonCount}>{completed}/{total} bài học</span>
                    </div>
                    <div className={styles.rightNav} onClick={handleViewNotes}>
                        <FontAwesomeIcon icon={faStickyNote} className={styles.noteIcon} />
                        Xem ghi chú
                    </div>
                    <NoteViewer
                        show={showNoteViewer}
                        handleClose={handleCloseViewer}
                        notes={notes}
                        lessonTitle={lesson?.title || 'No lesson title'}
                        courseTitle={courseDetail?.name || 'No Course title'}
                        navigate={navigate}
                        courseId={courseId}
                        setTimeToSeek={setTimeToSeek}
                        playerRef={playerRef}
                    />
                </div>
            </header>
            <div className={styles.main}>
                <div className={styles.containervideo}>
                    <div className={styles.videoContainer}>
                        {loading && <div className={styles.loading}>Loading...</div>}
                        {error && <div className={styles.error}>Error: {error}</div>}
                        {videoURL && (
                            <ReactPlayer
                                key={key}
                                ref={playerRef}
                                url={videoURL}
                                controls={true}
                                width="100%"
                                height="100%"
                                className={styles.reactPlayer}
                                onEnded={handleVideoEnded}
                                onProgress={handleProgress}
                                onReady={handlePlayerReady}
                                playing={playing}
                            />
                        )}
                    </div>
                    <div className={styles.courseContainer}>
                        <div className={styles.contentContainer}>
                            <div className={styles.courseContent}>
                                <nav className={styles.courseNav}>
                                    <ul className={styles.navList}>
                                        <div className={styles.ratingandescription}>
                                            <li
                                                className={`${styles.navItem} ${activeSection === 'overview' ? styles.active : ''}`}
                                                onClick={() => setActiveSection('overview')}
                                            >
                                                Tổng quan
                                            </li>
                                            <li
                                                className={`${styles.navItem} ${activeSection === 'review' ? styles.active : ''}`}
                                                onClick={() => setActiveSection('review')}
                                            >
                                                Đánh giá
                                            </li>
                                        </div>

                                        <div className={styles.notesHeader}>
                                            <FontAwesomeIcon icon={faStickyNote} className={styles.notesIcon} />
                                            <button className={styles.saveNoteButton} onClick={handleNoteClick}>
                                                <FontAwesomeIcon icon={faPlus} /> Thêm ghi chú tại {formatDuration(currentTime)}
                                            </button>
                                            <NoteModal
                                                show={showNoteModal}
                                                handleClose={handleCloseModal}
                                                handleSave={handleSaveNote}
                                                initialNote={currentNote}
                                                userId={user.uid}
                                                lessonId={lessonId}
                                                courseId={courseId}
                                                chapterId="123456"
                                                durationlesson={currentTime.toFixed(2)}
                                                Titlelesson={lesson.title}
                                                TitleCourse={courseDetail.name}
                                            />
                                        </div>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        {activeSection === 'overview' && (
                            <div className={styles.courseOverview}>
                                <h1>Giới thiệu về bài học</h1>
                                <p>{currentLessonDescription}</p>
                                <hr />
                            </div>
                        )}
                        {activeSection === 'review' && (
                            <div className={styles.reviewSection}>
                                <div className={styles.overallRating}>
                                    <h2>Phản hồi của học viên</h2>
                                    <div className={styles.ratingContainer}>
                                        <div className={styles.ratingValue}>{courseDetail.rating.toFixed(1)}</div>
                                        <div className={styles.stars}>
                                            {renderStars(courseDetail.rating)}
                                        </div>
                                    </div>
                                    <div className={styles.ratingBreakdown}>
                                        <div>★★★★★ {ratingBreakdown[4]}%</div>
                                        <div>★★★★ {ratingBreakdown[3]}%</div>
                                        <div>★★★ {ratingBreakdown[2]}%</div>
                                        <div>★★ {ratingBreakdown[1]}%</div>
                                        <div>★ {ratingBreakdown[0]}%</div>
                                    </div>
                                </div>
                                <div className={styles.reviewList}>
                                    <h3>Đánh giá</h3>
                                    <div className={styles.searchSort}>
                                        <input type="text" placeholder="Tìm kiếm đánh giá" />
                                        <select>
                                            <option value="all">Tất cả xếp hạng</option>
                                        </select>
                                    </div>
                                    <ul>
                                        {ratings.map((rating) => (
                                            <li key={rating._id}>
                                                <strong>{userNames[rating.userId] || rating.userId}</strong>
                                                <div>{'★'.repeat(rating.rating) + '☆'.repeat(5 - rating.rating)}</div>
                                                <p>{rating.feedback}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}


                        <RatingModal
                            show={showRatingModal}
                            handleClose={handleRatingModalClose}
                            handleSave={handleRatingSubmit}
                            userId={userId} // Pass userId
                            courseId={courseId} // Pass courseId
                        />
                    </div>
                </div>
                <aside className={styles.videoList}>
                    <div className={styles.courseContentHeader}>Nội dung khóa học</div>
                    <ul>
                        {chapters.sort((a, b) => a.chapterNumber - b.chapterNumber).map(chapter => (
                            <li key={chapter._id}>
                                <div className={styles.chapterHeader} onClick={() => toggleExpand(chapter._id)}>
                                    <div className={styles.iconntittle}>
                                        <span>{chapter.title}</span>
                                        <FontAwesomeIcon icon={expanded[chapter._id] ? faChevronUp : faChevronDown} />
                                    </div>
                                    <div className={styles.chapterDetails}>
                                        <span className={styles.goingcourse}>{getChapterDetails(chapter).completed}</span>
                                        <span className={styles.divider}>|</span>
                                        <span className={styles.durationchapter}>{getChapterDetails(chapter).duration}</span>
                                    </div>
                                </div>
                                {expanded[chapter._id] && (
                                    <ul className={styles.lessonList}>
                                        {lessons.filter(lesson => lesson.chapterId === chapter._id).map(lesson => (
                                            <li key={lesson._id} className={`${styles.lessonItem} ${lesson._id === lessonId ? styles.active : ''}`} onClick={() => handleLessonClick(lesson._id)}>
                                                <FontAwesomeIcon icon={faCircle} className={`${styles.lessonIcon} ${lessonscomplete.includes(lesson._id) ? styles.completed : ''}`} />
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
                <div className={styles.footerContent}>
                    <div className={styles.footerLogo}>
                        <img src={logo} alt="Gnosis Logo" />
                    </div>
                    <div className={styles.footerLinks}>
                        <a href="/about">About Us</a>
                        <a href="/contact">Contact</a>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                    </div>
                    <div className={styles.footerSocial}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </div>
                    <div className={styles.footerCopy}>
                        © 2024 GNOSIS. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LessonPage;
