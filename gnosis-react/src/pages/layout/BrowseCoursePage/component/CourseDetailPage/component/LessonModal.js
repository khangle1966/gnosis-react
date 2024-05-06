// LessonModal.js
import React, { useState } from 'react';
import styles from './LessonModal.module.scss'; // Import SCSS module

function LessonModal({ isOpen, onClose, onSubmit, lesson, setLesson }) {
    const [videoFile, setVideoFile] = useState(null);

    // Handle video file selection
    const handleVideoChange = event => {
        const file = event.target.files[0];
        setVideoFile(file);
        // Assuming we have a function to calculate video duration
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

    return (
        <div className={isOpen ? `${styles.modal} ${styles.open}` : styles.modal}>
            <form onSubmit={onSubmit}>
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
                <button type="submit">Lưu Lesson</button>
                <button type="button" onClick={onClose}>Đóng</button>
            </form>
        </div>
    );
}

export default LessonModal;
