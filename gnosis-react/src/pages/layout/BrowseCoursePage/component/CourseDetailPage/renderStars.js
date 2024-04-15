import React from 'react';
import styles from './CourseDetailPage.module.scss';

function renderStars(rating) {
    // Đảm bảo rằng rating là một số hợp lệ và không âm
    const numRating = Number(rating); // Chuyển đổi rating thành một số, nếu không phải số sẽ là NaN
    const safeRating = !isNaN(numRating) && numRating >= 0 ? numRating : 0;
    const totalStars = 5;
    const fullStars = Math.floor(safeRating);
    const halfStar = (safeRating % 1) >= 0.5 ? 1 : 0;
    const emptyStars = totalStars - fullStars - halfStar;

    // Kiểm tra nếu có bất kỳ giá trị nào không hợp lệ (ví dụ: số âm), chúng ta sẽ cài đặt lại chúng về 0
    if (fullStars < 0 || halfStar < 0 || emptyStars < 0 || fullStars + halfStar + emptyStars > totalStars) {
        console.error('Invalid star calculation', { fullStars, halfStar, emptyStars });
        return <div>Error displaying stars</div>;
    }

    return (
        <div>
            {Array(fullStars).fill(null).map((_, i) => <span key={`full-${i}`} className={styles.starFull}>★</span>)}
            {halfStar > 0 && <span key="half" className="starHalf">★</span>}
            {Array(emptyStars).fill(null).map((_, i) => <span key={`empty-${i}`} className={styles.starEmpty}>★</span>)}
        </div>
    );
}
export default renderStars;
