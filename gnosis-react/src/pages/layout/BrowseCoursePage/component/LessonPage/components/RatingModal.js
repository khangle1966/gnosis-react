import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './RatingModal.module.scss';

const RatingModal = ({ show, handleClose, handleSave, userId, courseId }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    if (!show) {
        return null;
    }

    const handleRatingClick = (rate) => {
        setRating(rate);
    };

    const handleSubmit = () => {
        handleSave({ rating, feedback, userId, courseId });
        setRating(0);
        setFeedback('');
    };

    const getRatingMessage = () => {
        switch (hoverRating || rating) {
            case 1: return "Rất tệ, hoàn toàn không như tôi mong đợi";
            case 2: return "Kém, khá thất vọng";
            case 3: return "Trung bình, lẽ ra có thể hay hơn";
            case 4: return "Tốt, như tôi mong đợi";
            case 5: return "Tuyệt vời, trên cả mong đợi!";
            default: return "Chọn xếp hạng";
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>Bạn sẽ xếp hạng khóa học này ở mức nào?</h2>
                <p>{getRatingMessage()}</p>
                <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                            key={star}
                            icon={faStar}
                            className={star <= (hoverRating || rating) ? styles.filledStar : styles.emptyStar}
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                </div>
                <textarea
                    className={styles.feedbackInput}
                    placeholder="Hãy cho chúng tôi biết trải nghiệm cá nhân của riêng bạn khi tham gia khóa học này. Khóa học có phù hợp với bạn không?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
                <button className={styles.saveButton} onClick={handleSubmit}>Lưu và tiếp tục</button>
            </div>
        </div>
    );
};

export default RatingModal;
