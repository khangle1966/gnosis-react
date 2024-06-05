import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { submitCourse, resetCourse } from '../../../redux/action/courseActions';
import styles from "./InstructorsPage.module.scss";
import { uploadImage } from '../../../redux/action/uploadActions'
import { useNavigate } from 'react-router-dom';



const InstructorsPage = () => {

    const { user } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const [courseSubmitted, setCourseSubmitted] = useState(false);
    // const [img, setImg] = useState(null);
    // const [isImageUploaded, setIsImageUploaded] = useState(false);
    const navigate = useNavigate();

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
    console.log('Course Data:', course); // Kiểm tra toàn bộ object course


    useEffect(() => {
        if (user.role !== 'instructor') {
            navigate('/login'); // Chuyển hướng nếu không phải là instructor
        }
    }, [user, navigate]);
    const handleChange = (event) => {
        const { id, value } = event.target;
        setCourse(prevCourse => ({ ...prevCourse, [id]: value }));
    };
    const handleImageChange = async (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            try {
                const imageUrl = await dispatch(uploadImage(imageFile)); // Upload image and get back the URL
                // setIsImageUploaded(true);
                // setImg(imageUrl);  // Cập nhật state img để kiểm tra điều kiện render hình ảnh
                setCourse(prevCourse => ({
                    ...prevCourse,
                    img: imageUrl // Store image URL in the course state
                }));
                console.log('Image URL:', imageUrl);  // Log URL mới để kiểm tra

            } catch (error) {
                console.error('Error uploading image:', error);
                alert("Lỗi tải ảnh lên. Vui lòng thử lại."); // Thông báo lỗi trực quan
            }
        }
    };





    const handleSubmit = async (event) => {
        event.preventDefault();

        dispatch(submitCourse(course));
        setCourseSubmitted(true);
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
                            <input type="text" id="price" value={course.price} onChange={handleChange} placeholder="USD, per course" />
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