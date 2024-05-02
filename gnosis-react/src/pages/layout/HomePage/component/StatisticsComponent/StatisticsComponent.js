import React from 'react';
import styles from './StatisticsComponent.module.scss';
console.log('CalendarComponent rendering');

const StatisticsComponent = ({ rating, timeSpent, coursesCompleted }) => (
  <div className={styles.statistics}>
    <div className={styles.statItem}>
      <span className={styles.statValue}>{rating}</span>
      <span className={styles.statLabel}>Rating</span>
    </div>
    <div className={styles.statItem}>
      <span className={styles.statValue}>{timeSpent}</span>
      <span className={styles.statLabel}>Time Spent</span>
    </div>
    <div className={styles.statItem}>
      <span className={styles.statValue}>{coursesCompleted}</span>
      <span className={styles.statLabel}>Courses Completed</span>
    </div>
  </div>
);

export default StatisticsComponent;
