import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoUrl } from '../../../../../redux/action/uploadActions';
import styles from './LessonPage.module.scss';
import { faArrowLeft, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown, faChevronUp, faCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchLessonsByCourseId } from '../../../../../redux/action/lessonActions';
import { fetchChaptersByCourseId } from '../../../../../redux/action/chapterActions';
import { fetchCourseDetail } from '../../../../../redux/action/courseActions';
import { completeLesson } from '../../../../../redux/action/lessonCompleteActions';
import { fetchLessonComplete } from '../../../../../redux/action/lessonCompleteActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteModal from './components/NoteModal';
import NoteViewer from './components/NoteViewer'; // Đảm bảo đường dẫn đúng
import { fetchNotes } from '../../../../../redux/action/noteActions';
export const LessonPage = () => {
    const { lessonId } = useParams(); // Lấy lessonId từ UuseRef RL
    const { courseId } = useParams(); // Giả sử bạn lấy courseId từ URL
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState({});
    const { videoURL, loading, error } = useSelector(state => state.uploadVideo);
    const { courseDetail } = useSelector(state => state.courseDetail);
    const { user } = useSelector(state => state.auth);
    const userId = user.uid; // Nên được thay thế bằng cách lấy ID người dùng hiện tại từ trạng thái auth hoặc session
    const [currentTime, setCurrentTime] = useState(0);
    const playerRef = useRef(null);  // Reference to the ReactPlayer
    const { chapters } = useSelector(state => state.chapterDetail);
    const { lessons } = useSelector(state => state.lessonDetail);
    const { lessonscomplete } = useSelector(state => state.lessonComplete);
    const [activeSection, setActiveSection] = useState('overview'); // Default to 'overview'
    const [lessonDescription, setLessonDescription] = useState('');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showNoteViewer, setShowNoteViewer] = useState(false);
    const [currentNote, setCurrentNote] = useState('');
    const [playing, setPlaying] = useState(true);






    const { notes, loading: loadingnotes, error: errornotes } = useSelector(state => state.notesData);

    console.log(notes);

    const handleProgress = (state) => {
        // state.playedSeconds is the number of seconds the video has been played
        setCurrentTime(state.playedSeconds);
    };
    const handleSeek = (time) => {
        playerRef.current.seekTo(time);
    };

    useEffect(() => {
        dispatch(fetchVideoUrl(lessonId));
        dispatch(fetchChaptersByCourseId(courseId));
        dispatch(fetchLessonsByCourseId(courseId));
        dispatch(fetchCourseDetail(courseId));

        dispatch(fetchLessonComplete(userId));
        dispatch(fetchNotes(userId));  // Tải ghi chú khi component được mount

    }, [dispatch, courseId, userId, lessonId]);

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

    const handleNoteClick = () => {
        setShowNoteModal(true);
        setPlaying(false);  // Dừng video khi mở modal

    };

    const handleCloseModal = () => {
        setShowNoteModal(false);
        setPlaying(true);  // Tiếp tục phát video khi đóng modal

    };
    const handleViewNotes = () => {
        setShowNoteViewer(true);
    };

    const handleCloseViewer = () => {
        setShowNoteViewer(false);
    };

    const handleSaveNote = (note) => {
        console.log('Saving note:', note); // Thực hiện lưu ghi chú
        setShowNoteModal(false);
        dispatch(fetchNotes(userId)); // Tải lại danh sách ghi chú

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

                    <div className={styles.rightNav} onClick={handleViewNotes}>
                        <FontAwesomeIcon icon={faStickyNote} className={styles.noteIcon} />
                        Xem ghi chú
                    </div>
                    <NoteViewer
                        show={showNoteViewer}
                        handleClose={handleCloseViewer}
                        notes={notes}
                        onTimeClick={handleSeek} // Truyền hàm handleSeek như một prop
                    />


                </div>
            </header>
            <div className={styles.main}>
                <div className={styles.containervideo}>
                    <div className={styles.videoContainer}>
                        {loading && <div className={styles.loading}>Loading...</div>}
                        {error && <div className={styles.error}>Error: {error}</div>}
                        {videoURL && <ReactPlayer
                            ref={playerRef}
                            url={videoURL}
                            controls={true}
                            width="100%"
                            height="100%"
                            className={styles.reactPlayer}
                            onEnded={handleVideoEnded}
                            onProgress={handleProgress}
                            playing={playing}

                        />}

                    </div>

                    <div className={styles.courseContainer}>

                        <div className={styles.contentContainer}> {/* Container mới cho nội dung khóa học và ghi chú */}
                            <div className={styles.courseContent}>

                                <nav className={styles.courseNav}>
                                    <ul className={styles.navList}>
                                        <div className={styles.ratingandescription}>
                                            <li className={styles.navItem} onClick={() => setActiveSection('overview')}>Tổng quan</li>

                                            <li className={styles.navItem} onClick={() => setActiveSection('review')}>Đánh giá</li>
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
                                                chapterId="123456" // Assume you have chapterId
                                                durationlesson={currentTime.toFixed(2)}
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
                                    <div className={styles.ratingValue}>4.7</div>
                                    <div>{/* Stars Rendering Component Here */}</div>
                                    <div className={styles.ratingBreakdown}>
                                        <div>★★★★★ 66%</div>
                                        <div>★★★★ 30%</div>
                                        <div>★★★ 4%</div>
                                        <div>★★ 0%</div>
                                        <div>★ 1%</div>
                                    </div>
                                </div>
                                <div className={styles.reviewList}>
                                    <h3>Đánh giá</h3>
                                    <div className={styles.searchSort}>
                                        <input type="text" placeholder="Tìm kiếm đánh giá" />
                                        <select>
                                            <option value="all">Tất cả xếp hạng</option>
                                            {/* Add more sorting options here */}
                                        </select>
                                    </div>
                                    <ul>
                                        {/* Map through reviews here */}
                                        <li>
                                            <strong>Muhammad Alim P.</strong>
                                            <div>{/* Star Rating Here */}★★★★☆</div>
                                            <p>my personal experience is so well what i expected but it match of my mind.</p>
                                        </li>
                                        {/* Repeat for other reviews */}
                                    </ul>
                                </div>
                            </div>

                        )}
                    </div>

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
