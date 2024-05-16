import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateRating } from '../../../../../../redux/action/courseActions';
import styles from './RatingComponent.module.scss';

const RatingComponent = ({ courseId, currentRating }) => {
    const [rating, setRating] = useState(currentRating);
    const dispatch = useDispatch();

    const handleRating = (rate) => {
        setRating(rate);
        dispatch(updateRating(courseId, rate));
    };

    return (
        <div className={styles.rating}>
            <h3>Rate this course</h3>
            {[1, 2, 3, 4, 5].map((rate) => (
                <span
                    key={rate}
                    className={rate <= rating ? styles.filled : styles.unfilled}
                    onClick={() => handleRating(rate)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default RatingComponent;
