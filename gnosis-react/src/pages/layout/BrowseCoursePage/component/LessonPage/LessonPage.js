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
    const { lessonId, courseId } = useParams(); // Lấy lessonId và courseId từ URL
    const navigate = useNavigate(); // Khởi tạo hook điều hướng
    const dispatch = useDispatch(); // Khởi tạo hook dispatch để gửi hành động

    const [expanded, setExpanded] = useState({}); // Trạng thái để lưu trạng thái mở rộng của các chương
    const { videoURL, loading, error } = useSelector(state => state.uploadVideo); // Lấy video URL và trạng thái tải video từ Redux
    const { courseDetail, loading: courseLoading } = useSelector(state => state.courseDetail); // Lấy thông tin chi tiết khóa học từ Redux
    const { user } = useSelector(state => state.auth); // Lấy thông tin người dùng từ Redux
    const userId = user ? user.uid : null; // Lấy userId từ thông tin người dùng, nếu user tồn tại thì lấy user.uid, nếu không thì null
    const [currentTime, setCurrentTime] = useState(0); // Trạng thái để lưu thời gian hiện tại của video
    const playerRef = useRef(null); // Tham chiếu đến ReactPlayer
    const { chapters } = useSelector(state => state.chapterDetail); // Lấy thông tin các chương từ Redux
    const { lessons } = useSelector(state => state.lessonDetail); // Lấy thông tin các bài học từ Redux
    const { lessonscomplete } = useSelector(state => state.lessonComplete); // Lấy thông tin các bài học đã hoàn thành từ Redux

    const [activeSection, setActiveSection] = useState('overview'); // Trạng thái để lưu phần đang hoạt động
    const [showNoteModal, setShowNoteModal] = useState(false); // Trạng thái để kiểm soát hiển thị modal ghi chú
    const [showNoteViewer, setShowNoteViewer] = useState(false); // Trạng thái để kiểm soát hiển thị trình xem ghi chú
    const [currentNote] = useState(''); // Trạng thái để lưu ghi chú hiện tại (không sử dụng, có thể bỏ đi)
    const [playing, setPlaying] = useState(true); // Trạng thái để lưu trạng thái phát của video
    const [timeToSeek, setTimeToSeek] = useState(null); // Thời gian để tìm kiếm trong video
    const [playerReady, setPlayerReady] = useState(false); // Trạng thái để lưu trạng thái sẵn sàng của player
    const [key, setKey] = useState(0); // Trạng thái để tạo khóa cho ReactPlayer, đảm bảo ReactPlayer được tái tạo khi bài học thay đổi
    const { lesson, loading: lessonLoading, error: lessonError } = useSelector(state => state.lessonDetail); // Lấy thông tin bài học từ Redux
    const { notes } = useSelector(state => state.notesData); // Lấy thông tin các ghi chú từ Redux
    const [showRatingModal, setShowRatingModal] = useState(false); // Trạng thái để kiểm soát hiển thị modal đánh giá
    const { ratings } = useSelector(state => state.ratings); // Lấy thông tin các đánh giá từ Redux
    const [userNames, setUserNames] = useState({}); // Trạng thái để lưu tên người dùng

    // Hàm để tính tổng số bài học và số bài học đã hoàn thành
    const getTotalAndCompletedLessons = () => {
        const total = lessons.length; // Tổng số bài học
        const completed = lessonscomplete.length; // Số bài học đã hoàn thành
        return { total, completed };
    };
    const { total, completed } = getTotalAndCompletedLessons(); // Lấy tổng số bài học và số bài học đã hoàn thành

    // useEffect để điều hướng đến bài học cuối cùng đã xem từ localStorage
    useEffect(() => {
        const lastViewedLesson = localStorage.getItem('lastViewedLesson');
        if (lastViewedLesson) {
            navigate(`/course/${courseId}/lesson/${lastViewedLesson}`);
        }
    }, [courseId, navigate]);

    // useEffect để lấy dữ liệu khi trang được tải
    useEffect(() => {
        if (completed === total && total !== 0) {
            dispatch(completeCourse(userId, courseId)); // Hoàn thành khóa học nếu tất cả các bài học đã hoàn thành
        }
        dispatch(fetchVideoUrl(lessonId)); // Lấy URL video của bài học
        dispatch(fetchChaptersByCourseId(courseId)); // Lấy danh sách chương của khóa học
        dispatch(fetchLessonsByCourseId(courseId)); // Lấy danh sách bài học của khóa học
        dispatch(fetchCourseDetail(courseId)); // Lấy thông tin chi tiết khóa học
        dispatch(fetchRatingsByCourseId(courseId)); // Lấy các đánh giá của khóa học
        dispatch(fetchLessonComplete(courseId, userId)); // Lấy thông tin bài học đã hoàn thành của người dùng
        dispatch(fetchNotes(userId)); // Lấy các ghi chú của người dùng
    }, [dispatch, courseId, userId, lessonId, completed, total]);

    // useEffect để lấy thông tin chi tiết của bài học khi lessonId thay đổi
    useEffect(() => {
        if (lessonId) {
            dispatch(fetchLessonById(lessonId)); // Lấy thông tin chi tiết của bài học
            setKey(prevKey => prevKey + 1); // Cập nhật khóa của ReactPlayer để tái tạo lại player
        }
    }, [dispatch, lessonId]);

    // useEffect để lấy thông tin profile của tất cả người dùng đã đánh giá
    useEffect(() => {
        ratings.forEach(rating => {
            if (!userNames[rating.userId]) {
                dispatch(fetchProfile(rating.userId)).then(profileData => {
                    if (profileData && profileData.userName) { // Kiểm tra profileData và userName có tồn tại không
                        setUserNames(prevUserNames => ({
                            ...prevUserNames,
                            [rating.userId]: profileData.userName
                        }));
                    }
                });
            }
        });
    }, [ratings, dispatch]);

    // Hàm để xử lý khi người dùng gửi đánh giá
    const handleRatingSubmit = (ratingData) => {
        dispatch(submitRating(ratingData)); // Gửi đánh giá
        dispatch(updateCourseRating(courseId, ratingData.rating)); // Cập nhật số lượng đánh giá của khóa học
        setShowRatingModal(false); // Đóng modal đánh giá
    };

    // Hàm để tính toán phần trăm đánh giá theo sao
    const calculateRatingBreakdown = (ratings) => {
        const totalRatings = ratings.length; // Tổng số đánh giá
        const breakdown = [0, 0, 0, 0, 0];

        ratings.forEach((rating) => {
            breakdown[rating.rating - 1] += 1; // Tính toán số lượng đánh giá theo sao
        });

        return breakdown.map((count) => Math.round((count / totalRatings) * 100)); // Tính toán phần trăm đánh giá theo sao
    };

    const ratingBreakdown = calculateRatingBreakdown(ratings); // Tính toán phần trăm đánh giá theo sao

    if (!lesson) {
        return <div>Loading lesson...</div>; // Hiển thị thông báo đang tải nếu bài học chưa tải xong
    }
    if (lessonLoading || courseLoading) return <div>Loading...</div>; // Hiển thị thông báo đang tải nếu bài học hoặc khóa học đang tải
    if (lessonError) return <div>Error: {lessonError}</div>; // Hiển thị lỗi nếu có lỗi xảy ra
    const currentLessonDescription = lessons.find(lesson => lesson._id === lessonId)?.description || "Loading lesson description..."; // Lấy mô tả của bài học hiện tại

    // Hàm để định dạng thời gian từ giây thành định dạng dễ đọc
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

    // Hàm để lấy chi tiết của chương (số bài học đã hoàn thành và tổng thời gian)
    const getChapterDetails = (chapter) => {
        const chapterLessons = lessons.filter(lesson => lesson.chapterId === chapter._id); // Lấy danh sách bài học của chương
        const completedLessons = chapterLessons.filter(lesson => lessonscomplete.includes(lesson._id)).length; // Đếm số bài học đã hoàn thành của chương
        const totalDuration = chapterLessons.reduce((sum, lesson) => sum + lesson.duration, 0); // Tính tổng thời gian của chương
        return {
            completed: `${completedLessons}/${chapterLessons.length}`,
            duration: formatDurationFromSeconds(totalDuration)
        };
    };

    // Hàm để xử lý khi player đã sẵn sàng
    const handlePlayerReady = () => {
        setPlayerReady(true); // Đánh dấu player đã sẵn sàng
        if (timeToSeek !== null) {
            playerRef.current.seekTo(timeToSeek); // Tìm đến thời gian đã lưu trước đó
            setTimeToSeek(null);
        }
    };

    // Hàm để cập nhật thời gian hiện tại của video
    const handleProgress = (state) => {
        setCurrentTime(state.playedSeconds); // Cập nhật thời gian hiện tại của video
        if (timeToSeek !== null && playerReady) {
            playerRef.current.seekTo(timeToSeek); // Tìm đến thời gian đã lưu trước đó
            setTimeToSeek(null);
        }
    };

    // Hàm để hiển thị modal ghi chú và tạm dừng video
    const handleNoteClick = () => {
        setShowNoteModal(true); // Hiển thị modal ghi chú
        setPlaying(false); // Tạm dừng video
    };

    // Hàm để đóng modal ghi chú và tiếp tục phát video
    const handleCloseModal = () => {
        setShowNoteModal(false); // Đóng modal ghi chú
        setPlaying(true); // Tiếp tục phát video
    };

    // Hàm để hiển thị trình xem ghi chú và tạm dừng video
    const handleViewNotes = () => {
        setShowNoteViewer(true); // Hiển thị trình xem ghi chú
        setPlaying(false); // Tạm dừng video
    };

    // Hàm để đóng trình xem ghi chú và tiếp tục phát video
    const handleCloseViewer = () => {
        setShowNoteViewer(false); // Đóng trình xem ghi chú
        setPlaying(true); // Tiếp tục phát video
    };

    // Hàm để lưu ghi chú và lấy lại các ghi chú của người dùng
    const handleSaveNote = (note) => {
        setShowNoteModal(false); // Đóng modal ghi chú
        dispatch(fetchNotes(userId)); // Lấy lại các ghi chú của người dùng
    };

    // Hàm để điều hướng đến bài học đã chọn
    const handleLessonClick = (lessonId) => {
        dispatch(fetchVideoUrl(lessonId)); // Lấy URL video của bài học
        localStorage.setItem('lastViewedLesson', lessonId); // Lưu bài học cuối cùng đã xem vào localStorage
        navigate(`/course/${courseId}/lesson/${lessonId}`); // Điều hướng đến bài học đã chọn
    };

    // Hàm để điều hướng về trang chủ
    const handleBackclick = (courseId) => {
        navigate(`/home`);
    };

    // Hàm để định dạng thời gian từ giây thành định dạng dễ đọc
    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsRemaining = Math.floor(seconds % 60);
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = secondsRemaining.toString().padStart(2, '0');
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }

    // Hàm để mở hoặc đóng chương
    const toggleExpand = chapterId => {
        setExpanded(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };

    // Hàm để xử lý khi video kết thúc
    const handleVideoEnded = () => {
        if (!lessonscomplete.includes(lessonId)) {
            dispatch(completeLesson(lessonId, userId, courseId)); // Hoàn thành bài học khi video kết thúc
        }
    };

    // Hàm để hiển thị modal đánh giá nếu người dùng chưa đánh giá
    const handleRatingClick = () => {
        if (completed > 0 && !ratings.some(rating => rating.userId === userId)) {
            setShowRatingModal(true);
        }
    };

    // Hàm để đóng modal đánh giá
    const handleRatingModalClose = () => {
        setShowRatingModal(false);
    };

    // Hàm để hiển thị các sao đánh giá
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
                    {completed > 0 && !ratings.some(rating => rating.userId === userId) && (
                        <div className={styles.ratingContainer} onClick={handleRatingClick}>
                            <FontAwesomeIcon icon={faStar} className={styles.ratingIcon} />
                            Đưa ra xếp hạng
                        </div>
                    )}
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
                            userId={userId}
                            courseId={courseId}
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
