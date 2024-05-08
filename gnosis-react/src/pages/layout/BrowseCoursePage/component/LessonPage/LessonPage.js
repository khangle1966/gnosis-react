import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoUrl } from '../../../../../redux/action/uploadActions';
import styles from './LessonPage.module.scss';

export const LessonPage = () => {
    const { lessonId } = useParams(); // Lấy lessonId từ URL
    const dispatch = useDispatch();

    const { videoURL, loading, error } = useSelector(state => state.uploadVideo);

    useEffect(() => {
        dispatch(fetchVideoUrl(lessonId));
    }, [dispatch, lessonId]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Video Lesson</h1>
            </header>
            <div className={styles.main}>
                <div className={styles.videoContainer}>
                    {loading && <div>Loading...</div>}
                    {error && <div>Error: {error}</div>}
                    {videoURL && <ReactPlayer url={videoURL} controls={true} width="100%" height="auto" />}
                </div>
                <aside className={styles.videoList}>
                    <ul>
                        <li>Related Video 1</li>
                        <li>Related Video 2</li>
                        <li>Related Video 3</li>
                    </ul>
                </aside>
            </div>
            <footer className={styles.footer}>
                © 2024 Your Company Name. All Rights Reserved.
            </footer>
        </div>
    );
};

export default LessonPage;
