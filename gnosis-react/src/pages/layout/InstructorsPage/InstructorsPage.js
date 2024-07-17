import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { submitCourse, resetCourse } from '../../../redux/action/courseActions';
import styles from "./InstructorsPage.module.scss";
import { uploadImage } from '../../../redux/action/uploadActions'
import { useNavigate } from 'react-router-dom';



const InstructorsPage = () => {

    // Lấy thông tin người dùng từ Redux store
    const { user } = useSelector(state => state.auth);

    // Khởi tạo hàm dispatch để gửi các action lên Redux store
    const dispatch = useDispatch();

    // Khởi tạo state để theo dõi trạng thái của việc submit khóa học
    const [courseSubmitted, setCourseSubmitted] = useState(false);

    // Sử dụng hook useNavigate để điều hướng trang
    const navigate = useNavigate();

    // Khởi tạo state để lưu thông tin khóa học
    const [course, setCourse] = useState({
        name: "",
        description: "",
        duration: "0",
        category: "",
        language: "",
        price: "",
        author: user.name, // Lấy tên tác giả từ thông tin người dùng
        authorId: user.uid, // Lấy ID tác giả từ thông tin người dùng
        describe: "test",
        request: "test",
        rating: "0",
        img: "",
        isReleased: false,
    });

    // In ra thông tin khóa học để kiểm tra
    console.log('Course Data:', course);

    // Sử dụng hook useEffect để kiểm tra vai trò người dùng và điều hướng nếu không phải là instructor
    useEffect(() => {
        if (user.role !== 'instructor') {
            navigate('/login'); // Điều hướng về trang đăng nhập nếu không phải instructor
        }
    }, [user, navigate]);

    // Hàm xử lý khi có thay đổi trong các input field
    const handleChange = (event) => {
        const { id, value } = event.target;
        setCourse(prevCourse => ({ ...prevCourse, [id]: value }));
    };

    // Hàm xử lý khi có thay đổi trong input hình ảnh
    const handleImageChange = async (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            try {
                const imageUrl = await dispatch(uploadImage(imageFile)); // Upload hình ảnh và nhận lại URL
                setCourse(prevCourse => ({
                    ...prevCourse,
                    img: imageUrl // Lưu URL hình ảnh vào state của khóa học
                }));
                console.log('Image URL:', imageUrl);  // In ra URL hình ảnh mới để kiểm tra
            } catch (error) {
                console.error('Error uploading image:', error);
                alert("Lỗi tải ảnh lên. Vui lòng thử lại."); // Thông báo lỗi cho người dùng
            }
        }
    };

    // Hàm xử lý khi submit form
    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(submitCourse(course)); // Gửi thông tin khóa học lên store
        setCourseSubmitted(true);
    };

    // Hàm xử lý khi reset form
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
            <div className={styles.breadcrumbs}>Home &gt; InstructorsPage</div>

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
                            <option value="Popular">Popular</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="English">English</option>
                            <option value="Music">Music</option>
                            <option value="Cook">Cook</option>

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
                            <input type="text" id="price" value={course.price} onChange={handleChange} placeholder="VNĐ, per course" />
                        </div>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    <button type="button" className={styles.uploadBtn} onClick={() => document.getElementById('imageInput').click()}>
                        Choose File
                    </button>
                    {course.img && <img src={course.img} alt="Course Cover" className={styles.uploadedImage} />}
                </div>


            </form>
        </div>
    );
};

export default InstructorsPage;