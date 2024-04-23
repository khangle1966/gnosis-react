import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCourse, submitCourse, resetCourse } from '../../../redux/action/courseActions';
import styles from "./InstructorsPage.module.scss";
import axios from 'axios';
const InstructorsPage = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [courseSubmitted, setCourseSubmitted] = useState(false);

    const [course, setCourse] = useState({
        name: "",
        description: "",
        duration: "0",
        category: "",
        language: "",
        price: "",
        author: user.name,
        authorId: user.uid,
        describe: "test",
        request: "test",
        rating: "0",
        img: "",
        isReleased: false,
    });
    // get user info from reducer 






    const [isImageUploaded, setIsImageUploaded] = useState(false);






    console.log('Course Data:', course); // Kiểm tra toàn bộ object course
    const handleChange = (event) => {
        const { id, value } = event.target;
        setCourse(prevCourse => ({ ...prevCourse, [id]: value }));
    };
    const handleUploadClick = () => {
        // Kích hoạt input file ẩn khi người dùng nhấn vào nút "Upload"
        document.getElementById('imageInput').click();
    };

    const handleImageChange = async (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            try {
                const response = await axios.post('http://localhost:3000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setCourse(prevCourse => ({ ...prevCourse, img: response.data.url }));
                setIsImageUploaded(true);
                console.log('Image uploaded and URL received:', response.data.url);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(submitCourse(course));
        setCourseSubmitted(true); // Đặt trạng thái thành công khi gửi khóa học
    };

    const handleReset = () => {
        setCourse({
            name: "",
            description: "",
            category: "",
            language: "",
            price: "",
            isReleased: false,
        });
    };

    return (
        <div className={styles.Container}>
            {courseSubmitted && (
                <div className={styles.successMessage}>
                    Khóa học đã được tạo thành công!
                </div>
            )}
            <div className={styles.Header}>
                <h1 className={styles.Title}>New Course Creation</h1>
                <div className={styles.Container_Button}>
                    <button type="button" className={styles.Cancel_Button} onClick={() => { dispatch(resetCourse()); handleReset(); }}>Reset</button>
                    <button type="button" className={styles.Publish_Button} onClick={handleSubmit}>Publish</button>
                </div>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.leftSection}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Title</label>


                        <input type="text" id="name" value={course.name} onChange={handleChange} placeholder="e.g. Networking Fundamentals" />
                    </div><div className={styles.formGroup}>
                        <label htmlFor="category">Category</label>
                        <select id="category" value={course.category} onChange={handleChange}>
                            <option value="">Select a category</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            {/* Thêm các lựa chọn khác dựa trên enum Category */}
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
                                <option value="">Select a Language</option>
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
                    <input type="file" id="imageInput" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    <div className={styles.uploadSection}>
                        <div className={styles.uploadArea}>
                            {/* Hiển thị hình ảnh đã chọn (nếu có) */}

                            {course.img && <img src={course.img} alt="Course Cover" style={{ width: 'auto', height: '100%' }} />}
                            <button type="button" className={styles.uploadBtn} onClick={handleUploadClick} style={{ opacity: isImageUploaded ? 0 : 1 }}>📷 Upload</button>

                            {/* Nút "Upload" để kích hoạt input file */}

                        </div>
                    </div>


                    {/* Các phần bổ sung về upload ảnh và quản lý bài giảng có thể được thêm vào đây */}
                </div>

            </form>
        </div>
    );
};

export default InstructorsPage;