import React, { useState, useEffect } from 'react';
import styles from './CourseDetailPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessonsByCourseId, fetchLessonsBychapterId } from '../../../../../redux/action/lessonActions';
import { fetchChaptersByCourseId, addChapter, removeChapter } from '../../../../../redux/action/chapterActions';
import renderStars from './renderStars';
import { fetchCourseDetail, updateCourseDetails } from '../../../../../redux/action/courseActions';
import { useParams } from 'react-router-dom';
<<<<<<< HEAD
import { Tooltip } from 'react-tooltip'; // Import Tooltip from react-tooltip
import { addItemToCart } from '../../../../../redux/action/cartActions';  // Import addItemToCart from cartActions
=======
// import { Tooltip } from 'react-tooltip'; // Import Tooltip from react-tooltip

>>>>>>> 77c5fe4a6b17baae2702ce2adf1683fe9a88e92a

export const CourseDetailPage = () => {
    const { courseId, chapterId } = useParams();
    console.log(courseId); // Kiểm tra giá trị này trong console để xác nhận

    const dispatch = useDispatch();
    const { courseDetail, loading: loadingCourse, error: errorCourse } = useSelector(state => state.courseDetail);
    const { lessons, loading: loadingLessons, error: errorLessons } = useSelector(state => state.lessonDetail);
    const { chapters, loadingChapters, errorChapters } = useSelector(state => state.chapterDetail);
    const { rating } = courseDetail;
<<<<<<< HEAD
=======
    const { user } = useSelector(state => state.auth);


>>>>>>> 77c5fe4a6b17baae2702ce2adf1683fe9a88e92a
    const [groupedChapters, setGroupedChapters] = useState([]);
    const [openChapters, setOpenChapters] = useState([]);
   
     

    const [editableCourse, setEditableCourse] = useState({ ...courseDetail });
    console.log("edit ", editableCourse)
    const [editMode, setEditMode] = useState(false);


    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetail(courseId));
            dispatch(fetchLessonsByCourseId(courseId));
            dispatch(fetchChaptersByCourseId(courseId));
            if (chapterId) {
                dispatch(fetchLessonsBychapterId(chapterId));
            }
        }
    }, [dispatch, courseId, chapterId]);

    useEffect(() => {
        setEditableCourse({ ...courseDetail });
    }, [courseDetail]);
    useEffect(() => {
        const sortedChapters = chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
        const chaptersMap = sortedChapters.reduce((acc, chapter) => {
            acc[chapter._id] = {
                title: `Chapter ${chapter.chapterNumber}: ${chapter.title}`,
                lessons: [], // Khởi tạo mảng rỗng cho lessons
                _id: chapter._id
            };
            return acc;
        }, {});

        // Chỉ thêm lessons vào các chapter nếu có lessons liên quan
        if (lessons.length > 0) {
            lessons.forEach(lesson => {
                if (chaptersMap[lesson.chapterId]) {
                    chaptersMap[lesson.chapterId].lessons.push(lesson);
                }
            });
        }

        setGroupedChapters(Object.values(chaptersMap));
    }, [lessons, chapters]);
    const handleAddToCart = () => {
        dispatch(addItemToCart(courseId));
    };

    const handleAddChapter = () => {
        const newChapterNumber = chapters.length + 1; // Tạo số thứ tự cho chương mới
        const newChapter = {
            title: `Chapter ${newChapterNumber}`,
            chapterNumber: newChapterNumber,
            courseId: courseId, // Sử dụng courseId đã có từ useParams
            lessons: []
        };
        dispatch(addChapter(newChapter)); // Gửi đến Redux store
    };
    const handleRemoveChapter = () => {
        if (chapters.length === 0) {
            alert("Không có chương nào để xóa.");
            return;
        }

        const lastChapterId = chapters[chapters.length - 1]._id; // Lấy ID của chương cuối cùng
        if (window.confirm('Bạn có chắc chắn muốn xoá chương mới nhất không?')) {
            dispatch(removeChapter(lastChapterId)); // Gửi đến Redux store để xóa
        }
    };

    const handleSaveChanges = () => {
        dispatch(updateCourseDetails(editableCourse));
        setEditMode(false);
    };
    const handlePriceInput = (e) => {
        const regex = /^[0-9]*$/; // Chỉ cho phép số
        if (!regex.test(e.target.textContent)) {
            e.preventDefault();
        }
    };

    // Hàm xử lý sự kiện khi giá bị thay đổi
    const handlePriceChange = (e) => {
        const price = e.target.textContent.replace(/\D/g, ''); // Lọc ra chỉ số từ nội dung nhập
        setEditableCourse({ ...editableCourse, price: price });
    };
    const handleCancelEdit = () => {
        setEditableCourse({ ...courseDetail });  // Khôi phục thông tin khóa học ban đầu
        setEditMode(false);
    };


    if (loadingCourse || loadingLessons || loadingChapters) {
        return <div>Đang tải...</div>;
    }

    if (errorCourse || errorLessons || errorChapters) {
        return <div>Lỗi: {errorCourse || errorLessons || errorChapters}</div>;
    }
    const handleToggleChapter = (chapterId) => {
        setOpenChapters(prev => {
            const isOpen = prev.includes(chapterId);
            return isOpen ? prev.filter(id => id !== chapterId) : [...prev, chapterId];
        });
    };

    const handleToggleAllChapters = () => {
        const anyChapterClosed = groupedChapters.some(chapter => !openChapters.includes(chapter._id));
        setOpenChapters(anyChapterClosed ? groupedChapters.map(chapter => chapter._id) : []);
    };

    // Static data structure for demonstration




    const totalChapters = chapters.length; // Tổng số chương dựa vào số lượng chương nhóm được
    const totalLessons = chapters.reduce((total, chapter) => total + chapter.lessons.length, 0); // Tổng số bài học

    // Tổng thời lượng bằng giây
    const totalDurationSeconds = chapters.reduce((total, chapter) => {
        return total + chapter.lessons.reduce((chapterTotal, lesson) => {
            // Chuyển đổi thời lượng từ giờ sang giây
            return chapterTotal + lesson.duration * 3600; // Giả sử duration là giờ
        }, 0);
    }, 0);

    // Chuyển tổng thời lượng từ giây sang giờ và phút
    const totalHours = Math.floor(totalDurationSeconds / 3600);
    const totalMinutes = Math.floor((totalDurationSeconds % 3600) / 60);



    return (
        <>
            <nav className={styles.navbar}>
                {/* You can add your logo, navigation links or any other content here */}

                <h1 className={styles.courseTitle}>{courseDetail.name}</h1>
                {/* Add additional nav items here if needed */}
            </nav>
            <div className={styles.courseSidebar}>
                <div className={styles.coursePreview}>
                    {/* Assume you have a thumbnail image or video here */}

                    {courseDetail.img && <img src={courseDetail.img} alt="Hình ảnh khóa học" className={styles.courseImage} />}
                </div>
                <div className={styles.coursePurchase}>
<<<<<<< HEAD
                    <div className={styles.coursePrice}>${courseDetail.price}</div>
                    <button className={styles.addToCartButton} onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
=======
                    <div
                        className={`${styles.coursePrice} ${editMode ? styles.editable : ''}`}
                        contentEditable={editMode}
                        onInput={(e) => handlePriceInput(e)}
                        onBlur={(e) => handlePriceChange(e)}
                        dangerouslySetInnerHTML={{ __html: `$${courseDetail.price}` }}
                    />

                    <button className={styles.addToCartButton}>Thêm vào giỏ hàng</button>
>>>>>>> 77c5fe4a6b17baae2702ce2adf1683fe9a88e92a
                    <button className={styles.buyNowButton}>Mua ngay</button>
                    <div className={styles.moneyBackGuarantee}>Đảm bảo hoàn tiền trong 30 ngày</div>
                </div>
                <div className={styles.courseIncludes}>
                    <h4>Khóa học này bao gồm:</h4>
                    <ul>
                        <li>12,5 giờ video theo yêu cầu</li>
                        <li>4 bài viết</li>
                        <li>Truy cập không giới hạn trên thiết bị di động và TV</li>
                        <li>Quyền truy cập đầy đủ suốt đời</li>
                        <li>Giấy chứng nhận hoàn thành</li>
                    </ul>
                </div>
                {/* Additional sections like "Share", "Gift this course", "Apply coupon" can be added here */}
            </div>

            <div className={styles.courseDetailContainer}>

                <div className={styles.courseHeader}>
                    <div className={styles.breadcrumbs}>Home &gt; Browse Course &gt; {courseDetail.name} </div>

                    <h1
                        className={`${styles.courseTitle} ${editMode ? styles.editable : ''}`}

                        contentEditable={editMode}
                        onBlur={(e) => setEditableCourse({ ...editableCourse, name: e.target.textContent })}
                        dangerouslySetInnerHTML={{ __html: courseDetail.name }}
                    />


                    <p className={styles.courseSubtitle}>{courseDetail.subTitle}</p>

                    <div className={styles.courseRating}>
                        <span className={styles.rating}>({courseDetail.rating})</span>


                        {renderStars(rating)}


                        <span>(110 xếp hạng)</span>
                        <span className={styles.enrollment}>528 học viên</span>
                    </div>
                    <div className={styles.instructorInfo}>
                        Được tạo bởi <a href='/default' > {courseDetail.author} </a>
                        <span className={styles.updateDate}>Lần cập nhật gần đây nhất 11/2023</span>
                        <span

                            className={`${styles.language} ${editMode ? styles.editable : ''}`}

                            contentEditable={editMode}
                            onBlur={(e) => setEditableCourse({ ...editableCourse, language: e.target.textContent })}
                            dangerouslySetInnerHTML={{ __html: courseDetail.language }}
                        />

                        {user.uid === courseDetail.authorId && (
                            <div className={styles.editPrompt}>
                                Bạn là chủ khóa học , vào mode chỉnh sửa ?
                                {editMode ? (
                                    <>
                                        <button onClick={handleSaveChanges} className={styles.saveButton}>Lưu Thay Đổi</button>
                                        <button onClick={handleCancelEdit} className={styles.exitButton}>Thoát</button>
                                    </>
                                ) : (
                                    <button onClick={() => setEditMode(true)} className={styles.editButton}>Chỉnh sửa</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>



                <div className={styles.courseContent2}>
                    <h2>Nội dung bài học</h2>
                    {/* Static data for demonstration */}



                    <div className={styles.item}>
                        <div
                            className={`${styles.title} ${editMode ? styles.editable : ''}`}
                            contentEditable={editMode}
                            onBlur={(e) => setEditableCourse({ ...editableCourse, description: e.target.textContent })}
                            dangerouslySetInnerHTML={{ __html: courseDetail.description }}
                        />



                    </div>




                </div>
                <div className={styles.courseContentOverview}>
                    <h2>Nội dung khóa học</h2>
                    <span>{totalChapters} phần · {totalLessons} bài giảng · {totalHours} giờ {totalMinutes} phút tổng thời lượng</span>
                    <button onClick={handleToggleAllChapters}>Mở rộng/tắt tất cả các chương</button>

                </div>
                {editMode && (
                    <>
                        <button className={styles.addChapterButton} onClick={handleAddChapter}>Thêm chương mới</button>
                        <button className={styles.removeChapterButton} onClick={() => handleRemoveChapter(chapterId)}>Xoá chương hiện tại</button>
                    </>
                )}
                <div className={styles.courseContent}>
                    {groupedChapters.map(chapter => (
                        <div key={chapter._id} className={styles.list}>
                            <div className={styles.item} onClick={() => handleToggleChapter(chapter._id)}>
                                <h4>


                                    <span>{chapter.title}</span> {/* Thêm text cho tooltip */}

                                </h4>
                                <div className={styles.duration}>{chapter.lessons.length} Bài</div>
                            </div>
                            {openChapters.includes(chapter._id) && (
                                <ul className={styles.sublist}>
                                    {chapter.lessons.map(lesson => (
                                        <li key={lesson._id} className={styles.lesson} data-tip={lesson.description}>
                                            <span className={styles.lessonTitle}>{lesson.title}</span>
                                            <span className={styles.lessonDuration}>{lesson.duration}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.requirements}>
                    <h3>Yêu cầu</h3>
                    <div
                        className={`${styles.title} ${editMode ? styles.editable : ''}`}
                        contentEditable={editMode}
                        onBlur={(e) => setEditableCourse({ ...editableCourse, request: e.target.textContent })}
                        dangerouslySetInnerHTML={{ __html: courseDetail.request }}
                    />


                </div>

                <div className={styles.description}>
                    <h3>Mô tả</h3>
                    <div
                        className={`${styles.title} ${editMode ? styles.editable : ''}`}

                        contentEditable={editMode}
                        onBlur={(e) => setEditableCourse({ ...editableCourse, describe: e.target.textContent })}
                        dangerouslySetInnerHTML={{ __html: courseDetail.describe }}
                    />




                    {/* ...tiếp tục thêm toàn bộ nội dung mô tả từ hình ảnh... */}
                </div>

            </div>

        </>
    );
};

export default CourseDetailPage;
