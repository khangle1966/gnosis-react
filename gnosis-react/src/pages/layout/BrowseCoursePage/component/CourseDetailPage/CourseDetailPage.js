import React, { useState, useEffect } from 'react';
import styles from './CourseDetailPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessonsByCourseId, fetchLessonsBychapterId, addLesson } from '../../../../../redux/action/lessonActions';
import { fetchChaptersByCourseId, addChapter, removeChapter, updateChapterTitle } from '../../../../../redux/action/chapterActions';
import renderStars from './renderStars';
import { fetchCourseDetail, updateCourseDetails } from '../../../../../redux/action/courseActions';
import { useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'; // Import Tooltip from react-tooltip
import { addToCart } from '../../../../../redux/action/cartActions';  // Import addItemToCart from cartActions



export const CourseDetailPage = () => {
    const { courseId, chapterId } = useParams();
    console.log(chapterId); // Kiểm tra giá trị này trong console để xác nhận

    const dispatch = useDispatch();
    const { courseDetail, loading: loadingCourse, error: errorCourse } = useSelector(state => state.courseDetail);
    const { lessons, loading: loadingLessons, error: errorLessons } = useSelector(state => state.lessonDetail);
    const { chapters, loadingChapters, errorChapters } = useSelector(state => state.chapterDetail);
    const { rating } = courseDetail;

    const { user } = useSelector(state => state.auth);
    const [newLesson, setNewLesson] = useState({ title: '', description: '', duration: 0 });
    const [showAddLessonForm, setShowAddLessonForm] = useState(null); // Quản lý việc hiển thị form của từng chapter
    console.log(chapters); // Kiểm tra giá trị này trong console để xác nhận
    const [groupedChapters, setGroupedChapters] = useState([]);
    const [openChapters, setOpenChapters] = useState([]);

   
     

    const [selectedChapterId, setSelectedChapterId] = useState("");


    const [editableCourse, setEditableCourse] = useState({ ...courseDetail });
    const [selectedChapter, setSelectedChapter] = useState(null);

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
        console.log(courseDetail);
        dispatch(addToCart(courseDetail));
    };
    const handleBuyCourse = (course) => {
        console.log("Purchasing course:", course.name);
        // Thêm logic thanh toán ở đây hoặc chuyển hướng người dùng tới trang thanh toán
    }
    const handleSelectChapter = (chapter) => {
        if (editMode) {
            setSelectedChapter({ ...chapter });
        }
    };

    const handleTitleChange = (e) => {
        setSelectedChapter(prev => ({ ...prev, title: e.target.value }));
    };

    const handleSaveTitle = (chapterId, title) => {
        dispatch(updateChapterTitle(chapterId, title));
        setSelectedChapter(null);

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
        const chapterToRemove = selectedChapterId;
        if (!chapterToRemove) {
            alert("Vui lòng chọn chương để xoá.");
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xoá chương này không?')) {
            dispatch(removeChapter(chapterToRemove)); // Gửi đến Redux store để xóa
        }
    };

    const handleAddLesson = (event, chapterId) => {
        event.preventDefault();
        const lessonData = { ...newLesson, chapterId, courseId: courseId };  // Assuming `courseId` is available in your component
        dispatch(addLesson(lessonData));
        setNewLesson({ title: '', description: '', duration: 0 }); // Reset form fields after dispatch
        setShowAddLessonForm(null); // Hide the form after submission
    };
    const handleSaveChanges = () => {
        dispatch(updateCourseDetails(editableCourse));
        setEditMode(false);
    };
    const handleCancelEdit = () => {
        setEditableCourse({ courseDetail });  // Khôi phục thông tin khóa học ban đầu
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

                    <div
                        className={`${styles.coursePrice} ${editMode ? styles.editable : ''}`}
                        contentEditable={editMode}
                        onInput={(e) => handlePriceInput(e)}
                        onBlur={(e) => handlePriceChange(e)}
                        dangerouslySetInnerHTML={{ __html: `$${courseDetail.price}` }}
                    />

                    <button className={styles.addToCartButton}onClick={handleAddToCart}>Add to Cart</button>
                    <button className={styles.buyNowButton}onClick={handleBuyCourse}>Buy Now</button>
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
                        <div className={styles.customselect}>
                            <select value={selectedChapterId} onChange={(e) => setSelectedChapterId(e.target.value)}>
                                <option value="">Chọn chương để xoá</option>
                                {chapters.map(chapter => (
                                    <option key={chapter._id} value={chapter._id}>{chapter.title}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
                <div className={styles.courseContent}>
                    {groupedChapters.map((chapter, index) => (
                        <div key={chapter._id} className={styles.list}>
                            <div className={styles.item} onClick={() => handleToggleChapter(chapter._id)}>


                                <div key={chapter._id}>
                                    {selectedChapter && selectedChapter._id === chapter._id ? (
                                        <input
                                            type="text"
                                            value={selectedChapter.title}
                                            onChange={handleTitleChange}
                                            onBlur={() => handleSaveTitle(chapter._id, selectedChapter.title)}
                                        />
                                    ) : (
                                        <h4 onClick={() => handleSelectChapter(chapter)}>{chapter.title}</h4>
                                    )}
                                </div>


                                <div className={styles.duration}>{chapter.lessons.length} Bài</div>
                            </div>
                            {editMode && (
                                <>
                                    <button onClick={() => setShowAddLessonForm(index)} className={styles.addLessonButton}>
                                        Thêm Lesson
                                    </button>
                                    {showAddLessonForm === index && (
                                        <form onSubmit={(e) => handleAddLesson(e, chapter._id)}>
                                            <input
                                                type="text"
                                                required
                                                value={newLesson.title}
                                                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                                placeholder="Lesson Title"
                                            />
                                            <textarea
                                                required
                                                value={newLesson.description}
                                                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                                                placeholder="Lesson Description"
                                            />
                                            <input
                                                type="number"
                                                required
                                                value={newLesson.duration}
                                                onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                                                placeholder="Duration (in hours)"
                                            />
                                            <button type="submit">Lưu Lesson</button>
                                        </form>
                                    )}
                                </>
                            )}
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




                 
                </div>

            </div>

        </>
    );
};

export default CourseDetailPage
