// LessonModal.js
import React from 'react';
import styles from './LessonModal.module.scss'; // Import SCSS module

function LessonModal({ isOpen, onClose, onSubmit, lesson, setLesson }) {
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
                    type="number"
                    required
                    value={lesson.duration}
                    onChange={e => setLesson({ ...lesson, duration: e.target.value })}
                    placeholder="Duration (in hours)"
                />
                <button type="submit">Lưu Lesson</button>
                <button type="button" onClick={onClose}>Đóng</button>
            </form>
        </div>
    );
}

export default LessonModal;
