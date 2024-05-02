import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Đường dẫn này phụ thuộc vào cấu trúc thư mục của bạn
import styles from './CalendarComponent.module.scss'; // Import SCSS module

const CalendarComponent = () => {
    const [date, setDate] = useState(new Date());

    const handleDateChange = (newDate) => {
        setDate(newDate);
        // Có thể thực hiện thêm hành động nào đó khi ngày thay đổi
    };

    return (
        <div className={styles.calendarComponent}>
            <Calendar
                className={styles.reactCalendar} 
                onChange={handleDateChange}
                value={date}
            />
        </div>
    );
};

export default CalendarComponent;
