import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCourse, submitCourse, resetCourse } from '../../../redux/action/courseActions';
import styles from "./InstructorsPage.module.scss";

const InstructorsPage = () => {
    const dispatch = useDispatch();
    // Chắc chắn rằng state đã được khởi tạo hoặc sử dụng giá trị mặc định
    const [course, setCourse] = useState({
        name: "",
        description: "",
        duration: "",
        category: "",
        language: "",
        price: "",
        author: "",
        describe: "d",
        request: "d",
        rating: "",

        isReleased: false,
    });




    console.log('Course Data:', course); // Kiểm tra toàn bộ object course
    const handleChange = (event) => {
        const { id, value } = event.target;
        setCourse(prevCourse => ({ ...prevCourse, [id]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Nếu bạn muốn sử dụng Redux để xử lý submit
        dispatch(submitCourse(course));
        // Hoặc gửi form bằng API call tại đây nếu không sử dụng Redux
    };

    const handleReset = () => {
        setCourse({
            name: "",

            description: "",
            duration: "2",
            category: "",
            language: "",
            price: "22",
            auth: "test",
            describe: "d",
            request: "d",
            rating: "",

            isReleased: false,
        });
    };

    return (
        <div className={styles.Container}>
            <div className={styles.Header}>
                <h1 className={styles.Title}>New Course Creation</h1>
                <div className={styles.Container_Button}>
                    <button type="button" className={styles.Cancel_Button} onClick={() => dispatch(resetCourse())}>Cancel</button>
                    <button type="button" className={styles.Publish_Button} onClick={handleSubmit}>Publish</button>
                </div>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.leftSection}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Title</label>


                        <input type="text" id="name" value={course.name} onChange={handleChange} placeholder="e.g. Networking Fundamentals" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="category">Category</label>
                        <select id="category" value={course.category} onChange={handleChange}>
                            <option value="it_certifications">IT Certifications</option>
                            {/* Thêm các lựa chọn khác ở đây */}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea id="description" placeholder="Course Description" maxLength="2500" value={course.description} onChange={handleChange}></textarea>
                    </div>
                    <div className={styles.formGroupDual}>
                        <div className={styles.language}>
                            <label htmlFor="language">Language</label>
                            <select id="language" value={course.language} onChange={handleChange}>
                                <option value="english">English</option>
                                <option value="vietnam">Việt Nam</option>



                            </select>
                        </div>
                        <div className={styles.price}>
                            <label htmlFor="price">Price</label>
                            <input type="text" id="price" value={course.price} onChange={handleChange} placeholder="USD, per course" />
                        </div>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.uploadSection}>
                        <h2>COVER IMAGE</h2>
                        <div className={styles.uploadArea}>
                            <button type="button" className={styles.uploadBtn}>📷 Upload</button>
                        </div>
                    </div>

                    <div className={styles.uploadSection}>
                        <h2>LECTURES</h2>
                        <div className={styles.uploadArea}>
                            <button type="button" className={styles.uploadLessonBtn}>📁 Upload</button>
                            <button type="button" className={styles.addBtn}>➕ Add</button>
                        </div>
                    </div>
                    {/* Các phần bổ sung về upload ảnh và quản lý bài giảng có thể được thêm vào đây */}
                </div>

            </form>
        </div>
    );
};

export default InstructorsPage;
