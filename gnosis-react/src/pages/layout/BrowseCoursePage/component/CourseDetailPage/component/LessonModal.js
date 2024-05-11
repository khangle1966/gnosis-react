// LessonModal.js
import React, { useState } from 'react';
import styles from './LessonModal.module.scss'; // Import SCSS module
import { uploadVideo } from '../../../../../../redux/action/uploadActions';
import { useDispatch, useSelector } from 'react-redux';

function LessonModal({ isOpen, onClose, onSubmit, lesson, setLesson }) {
    const [videoFile, setVideoFile] = useState(null);
    const dispatch = useDispatch();
    const uploadProgress = useSelector(state => state.uploadVideo.uploadProgress); // Lấy tiến trình upload từ Redux store
    const isLoading = useSelector(state => state.uploadVideo.loading); // Lấy trạng thái loading từ Redux store
    console.log(isLoading)
    // Handle video file selection
    const handleVideoChange = event => {
        const file = event.target.files[0];
        setVideoFile(file);
        calculateVideoDuration(file).then(duration => {
            setLesson({ ...lesson, duration });
        });
    };

    // Dummy function to calculate video duration
    // In reality, you would use a library or API to get this information
    const calculateVideoDuration = (file) => {
        return new Promise(resolve => {
            const videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(file);
            videoElement.addEventListener('loadedmetadata', () => {
                resolve(videoElement.duration);
                URL.revokeObjectURL(videoElement.src);
            });
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (videoFile) {
            const videoUrl = await dispatch(uploadVideo(videoFile));
            setLesson({ ...lesson, videoUrl });
            onSubmit({ ...lesson, videoUrl });
        } else {
            onSubmit(lesson);
        }
    };

    return (
        <div className={isOpen ? `${styles.modal} ${styles.open}` : styles.modal}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    required
                    value={lesson.title}
                    onChange={e => setLesson({ ...lesson, title: e.target.value })}
                    placeholder="Lesson Title"
                />
                <textarea
                    required
                    value={lesson.description}
                    onChange={e => setLesson({ ...lesson, description: e.target.value })}
                    placeholder="Lesson Description"
                />
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    required
                />
                {videoFile && (
                    <p>Duration: {lesson.duration ? `${Math.floor(lesson.duration / 60)} min ${Math.floor(lesson.duration % 60)} sec` : "Calculating..."}</p>
                )}
                {uploadProgress > 0 && (
                    <div className={styles.progress}>
                        <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }}>
                            Uploading: {uploadProgress}%
                        </div>
                    </div>
                )}
                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? <><span className={styles.spinner}></span> Đang Lưu...</> : 'Lưu Lesson'}
                </button>
                <button type="button" className={styles.button} disabled={isLoading} onClick={onClose}>Đóng</button>
            </form>
        </div>
    );
}

export default LessonModal;
