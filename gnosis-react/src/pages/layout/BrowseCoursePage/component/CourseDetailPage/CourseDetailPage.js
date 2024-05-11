import React, { useState, useEffect, useMemo } from 'react';
import styles from './CourseDetailPage.module.scss';

import { useDispatch, useSelector } from 'react-redux';
import { fetchLessonsByCourseId, fetchLessonsBychapterId, addLesson, deleteLesson } from '../../../../../redux/action/lessonActions';
import { fetchChaptersByCourseId, addChapter, removeChapter, updateChapterTitle } from '../../../../../redux/action/chapterActions';
import renderStars from './renderStars';
import { fetchCourseDetail, updateCourseDetails } from '../../../../../redux/action/courseActions';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCart } from '../../../../../redux/action/cartActions';  // Import addItemToCart from cartActions
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updateChapterOrder } from '../../../../../redux/action/chapterActions';
import { ObjectId } from 'bson';
import LessonModal from './component/LessonModal'; // Đảm bảo rằng bạn đã import LessonModal đúng


export const CourseDetailPage = () => {
    const { courseId, chapterId } = useParams();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { courseDetail, loading: loadingCourse, error: errorCourse } = useSelector(state => state.courseDetail);
    const { lessons, loading: loadingLessons, error: errorLessons } = useSelector(state => state.lessonDetail);
    const { chapters, loadingChapters, errorChapters } = useSelector(state => state.chapterDetail || { chapters: [] });


    const { rating } = courseDetail;

    const { user } = useSelector(state => state.auth);
    const [newLesson, setNewLesson] = useState({ title: '', description: '', duration: 0, courseId: courseId });
    const [showModal, setShowModal] = useState(false);

    const [groupedChapters, setGroupedChapters] = useState([]);
    const [openChapters, setOpenChapters] = useState([]);


    useEffect(() => {
        const totalChapters = groupedChapters.length;
        const totalLessons = groupedChapters.reduce((total, chapter) => total + (Array.isArray(chapter.lessons) ? chapter.lessons.length : 0), 0);
        console.log("Total chapters:", totalChapters, "Total lessons:", totalLessons);
    }, [groupedChapters]);


    const [selectedChapterId, setSelectedChapterId] = useState(null);


    const [editableCourse, setEditableCourse] = useState({ ...courseDetail });
    const [selectedChapter, setSelectedChapter] = useState(null);

    const [editMode, setEditMode] = useState(false);
    const { totalChapters, totalLessons, formattedDuration } = useMemo(() => {
        const totalChapters = groupedChapters.length;
        const totalLessons = groupedChapters.reduce((total, chapter) => {
            return total + (Array.isArray(chapter.lessons) ? chapter.lessons.length : 0);
        }, 0);

        const totalDurationSeconds = groupedChapters.reduce((total, chapter) => {
            return total + (Array.isArray(chapter.lessons) ? chapter.lessons.reduce((chapterTotal, lesson) => {
                return chapterTotal + ((typeof lesson.duration === 'number') ? lesson.duration : 0);
            }, 0) : 0);
        }, 0);

        // Format duration from seconds to a readable format
        const hours = Math.floor(totalDurationSeconds / 3600);
        const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
        const seconds = Math.floor(totalDurationSeconds % 60);
        const formattedDuration = `${hours} giờ ${minutes} phút ${seconds} giây`;

        return { totalChapters, totalLessons, formattedDuration };
    }, [groupedChapters]);




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
        // Kiểm tra chapters trước khi sử dụng
        if (!chapters || !Array.isArray(chapters)) return;

        const sortedChapters = [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);
        const chaptersMap = sortedChapters.reduce((acc, chapter) => {
            acc[chapter._id] = {
                title: `${chapter.title}`,
                lessons: [], // Khởi tạo mảng rỗng cho lessons
                _id: chapter._id
            };
            return acc;
        }, {});

        if (lessons && lessons.length > 0) {
            lessons.forEach(lesson => {
                if (chaptersMap[lesson.chapterId]) {
                    chaptersMap[lesson.chapterId].lessons.push(lesson);
                }
            });
        }

        setGroupedChapters(Object.values(chaptersMap));
    }, [lessons, chapters]);


    console.log('Grouped Chapters:', groupedChapters);


    const onDragEnd = async (result) => {
        if (!editMode) {
            return; // Không cho phép drag and drop nếu không ở chế độ chỉnh sửa
        }
        const { source, destination } = result;
        if (!destination || (source.index === destination.index && source.droppableId === destination.droppableId)) {
            return;
        }

        const newChapters = Array.from(groupedChapters);
        const [removed] = newChapters.splice(source.index, 1);
        newChapters.splice(destination.index, 0, removed);

        setGroupedChapters(newChapters);
        await dispatch(updateChapterOrder(newChapters.map((chap, index) => ({
            id: chap._id,
            chapterNumber: index + 1
        }))));
    };



    const formatDurationFromSeconds = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.round(seconds % 60);

        let formattedDuration = '';


        if (hours > 0) {
            formattedDuration += `${hours} giờ `;
        }

        formattedDuration += `${minutes} phút ${remainingSeconds} giây`;

        return formattedDuration;
    };

    const handleAddToCart = () => {
        console.log(courseDetail);
        dispatch(addToCart(courseDetail));
    };
    const handleBuyCourse = (course) => {
        console.log("Purchasing course:", course.name);
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
    const handleLessonClick = (lessonId) => {
        navigate(`/lesson/${lessonId}`);
    };
    const handleAddChapter = (currentChapterId) => {
        const index = groupedChapters.findIndex(chapter => chapter._id === currentChapterId);
        const newChapterNumber = groupedChapters.length + 1; // Cập nhật số thứ tự của chapter mới
        const newChapter = {
            _id: new ObjectId().toString(), // Tạo ObjectId mới
            title: `Chapter ${newChapterNumber}`,
            chapterNumber: newChapterNumber,
            courseId: courseId,
            lessons: []
        };

        // Tạo một bản sao của mảng groupedChapters và chèn chapter mới vào vị trí ngay sau chapter hiện tại
        const newChapters = [
            ...groupedChapters.slice(0, index + 1),
            newChapter,
            ...groupedChapters.slice(index + 1)
        ];

        setGroupedChapters(newChapters); // Cập nhật state
        dispatch(addChapter(newChapter)); // Gửi đến Redux store
    };
    const handleRemoveChapter = (chapterId) => {
        dispatch(removeChapter(chapterId)); // Gửi đến Redux store để xóa

    };

    const handleAddLesson = (lesson) => {
        const lessonData = { ...lesson, chapterId: selectedChapterId };
        dispatch(addLesson(lessonData)); // Gửi action đến Redux store

        setShowModal(false); // Đóng modal sau khi submit
        setNewLesson({ title: '', description: '', duration: 0, courseId: courseId }); // Reset form
    };


    const handleDeleteLesson = (lessonId) => {
        dispatch(deleteLesson(lessonId));
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




    // Tổng thời lượng bằng giây




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

                    <button className={styles.addToCartButton} onClick={handleAddToCart}>Add to Cart</button>
                    <button className={styles.buyNowButton} onClick={handleBuyCourse}>Buy Now</button>
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
                    <span>{totalChapters} phần · {totalLessons} bài giảng · {formattedDuration} tổng thời lượng</span>
                    <button onClick={handleToggleAllChapters}>Mở rộng/tắt tất cả các chương</button>


                </div>
                {editMode && groupedChapters.length === 0 && (
                    <button
                        onClick={() => handleAddChapter(null)} // Sử dụng handleAddChapter với giá trị null để tạo chương mới mà không cần ID chương cụ thể
                        className={styles.addChapterButton}
                    >
                        Add Chapter
                    </button>
                )}
                <div className={styles.courseContent}>

                    <DragDropContext onDragEnd={onDragEnd} >
                        <Droppable droppableId="chapters">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {groupedChapters.map((chapter, index) => (
                                        <div key={chapter._id} className={styles.list}>
                                            {editMode ? (
                                                <Draggable draggableId={chapter._id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={styles.chapterRow} // Use a flex container for the row

                                                        >
                                                            <div className={styles.item} onClick={() => handleToggleChapter(chapter._id)}>
                                                                <div>
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
                                                                <div className={styles.right}>
                                                                    <div className={styles.duration}>{chapter.lessons.length} Bài</div>
                                                                    <div className={styles.chapterControls}>
                                                                        <button onClick={() => handleAddChapter(chapter._id)} className={styles.addChapterButton}>+</button>
                                                                        <button onClick={() => handleRemoveChapter(chapter._id)} className={styles.removeChapterButton}>-</button>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            {editMode && (
                                                                <>


                                                                    <button className={styles.addLessonButton} onClick={() => {
                                                                        setShowModal(true);
                                                                        setSelectedChapterId(chapter._id); // Lấy ID chương hiện tại từ state hoặc props
                                                                    }}>
                                                                        Thêm Lesson
                                                                    </button>
                                                                    <LessonModal
                                                                        isOpen={showModal}
                                                                        onClose={() => setShowModal(false)}
                                                                        onSubmit={handleAddLesson}
                                                                        lesson={newLesson}
                                                                        setLesson={setNewLesson}
                                                                    />
                                                                </>
                                                            )}
                                                            {openChapters.includes(chapter._id) && (
                                                                <ul className={styles.sublist}>
                                                                    {chapter.lessons.map(lesson => (
                                                                        <li key={lesson._id} className={styles.lesson} data-tip={lesson.description} >

                                                                            <span onClick={() => handleLessonClick(lesson._id)} className={styles.lessonTitle}>{lesson.title}</span>
                                                                            <div className={styles.left}>
                                                                                <span className={styles.lessonDuration}>{formatDurationFromSeconds(lesson.duration)}</span>
                                                                                <button className={styles.deleteLesson} onClick={() => handleDeleteLesson(lesson._id)}>-</button>
                                                                            </div>
                                                                        </li>

                                                                    ))}

                                                                </ul>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ) : (
                                                <div>
                                                    <div className={styles.item} onClick={() => handleToggleChapter(chapter._id)}>
                                                        <div>
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

                                                    {openChapters.includes(chapter._id) && (
                                                        <ul className={styles.sublist}>
                                                            {chapter.lessons.map(lesson => (
                                                                <li key={lesson._id} className={styles.lesson} data-tip={lesson.description} onClick={() => handleLessonClick(lesson._id)}>
                                                                    <span className={styles.lessonTitle}>{lesson.title}</span>
                                                                    <span className={styles.lessonDuration}>{formatDurationFromSeconds(lesson.duration)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
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
