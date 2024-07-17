import React, { useEffect, useState, useMemo } from 'react';
import styles from './CourseDetailPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchLessonsByCourseId,
    fetchLessonsBychapterId,
    addLesson,
    deleteLesson
} from '../../../../../redux/action/lessonActions'; // Import các hành động liên quan đến bài học
import {
    fetchChaptersByCourseId,
    addChapter,
    removeChapter,
    updateChapterTitle,
    updateChapterOrder
} from '../../../../../redux/action/chapterActions'; // Import các hành động liên quan đến chương
import renderStars from './renderStars'; // Import hàm renderStars để hiển thị đánh giá bằng sao
import {
    fetchCourseDetail,
    updateCourseDetails
} from '../../../../../redux/action/courseActions'; // Import các hành động liên quan đến khóa học
import { useParams, useNavigate } from 'react-router-dom'; // Import các hook để lấy tham số từ URL và điều hướng
import { addToCart } from '../../../../../redux/action/cartActions'; // Import hành động thêm vào giỏ hàng
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Import các thành phần để hỗ trợ kéo thả
import { ObjectId } from 'bson'; // Import ObjectId từ thư viện bson để tạo ID mới
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom để tạo liên kết

import LessonModal from './component/LessonModal'; // Import LessonModal
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import các kiểu dáng cho ReactQuill

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options); // Định dạng ngày tháng theo kiểu Việt Nam
};

export const CourseDetailPage = () => {
    const { courseId, chapterId } = useParams(); // Lấy các tham số từ URL
    const navigate = useNavigate(); // Khởi tạo hook điều hướng
    const dispatch = useDispatch(); // Khởi tạo hook dispatch để gửi hành động

    const { courseDetail, loading: loadingCourse } = useSelector(state => state.courseDetail); // Lấy thông tin chi tiết khóa học từ Redux store
    console.log(courseDetail.isReleased)
    const { lessons, loading: loadingLessons } = useSelector(state => state.lessonDetail); // Lấy danh sách bài học từ Redux store
    const { chapters, loadingChapters } = useSelector(state => state.chapterDetail || { chapters: [] }); // Lấy danh sách chương từ Redux store
    const { user } = useSelector(state => state.auth); // Lấy thông tin người dùng từ Redux store
    const { profile } = useSelector(state => state.profile); // Lấy thông tin profile từ Redux store

    const [newLesson, setNewLesson] = useState({ title: '', description: '', duration: 0, courseId: courseId }); // State để lưu thông tin bài học mới
    const [showModal, setShowModal] = useState(false); // State để kiểm soát hiển thị modal
    const [groupedChapters, setGroupedChapters] = useState([]); // State để lưu các chương đã nhóm
    const [openChapters, setOpenChapters] = useState([]); // State để lưu danh sách các chương đang mở
    const [editableCourse, setEditableCourse] = useState({ ...courseDetail }); // State để lưu thông tin khóa học có thể chỉnh sửa

    const isCoursePurchased = useMemo(() => {
        return profile && profile.courses && profile.courses.some(course => course._id === courseId); // Kiểm tra xem khóa học đã được mua chưa
    }, [profile, courseId]);

    useEffect(() => {
        const totalChapters = groupedChapters.length; // Tính tổng số chương
        const totalLessons = groupedChapters.reduce((total, chapter) => total + (Array.isArray(chapter.lessons) ? chapter.lessons.length : 0), 0); // Tính tổng số bài học
        console.log("Total chapters:", totalChapters, "Total lessons:", totalLessons); // In ra tổng số chương và bài học
    }, [groupedChapters]);

    const [selectedChapterId, setSelectedChapterId] = useState(null); // State để lưu ID chương được chọn
    const [selectedChapter, setSelectedChapter] = useState(null); // State để lưu chương được chọn
    const [editMode, setEditMode] = useState(false); // State để lưu trạng thái chỉnh sửa

    const { totalChapters, totalLessons, formattedDuration } = useMemo(() => {
        const totalChapters = groupedChapters.length; // Tính tổng số chương
        const totalLessons = groupedChapters.reduce((total, chapter) => {
            return total + (Array.isArray(chapter.lessons) ? chapter.lessons.length : 0); // Tính tổng số bài học
        }, 0);

        const totalDurationSeconds = groupedChapters.reduce((total, chapter) => {
            return total + (Array.isArray(chapter.lessons) ? chapter.lessons.reduce((chapterTotal, lesson) => {
                return chapterTotal + ((typeof lesson.duration === 'number') ? lesson.duration : 0); // Tính tổng thời gian của tất cả các bài học
            }, 0) : 0);
        }, 0);

        // Định dạng thời gian từ giây thành định dạng dễ đọc
        const hours = Math.floor(totalDurationSeconds / 3600);
        const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
        const seconds = Math.floor(totalDurationSeconds % 60);
        const formattedDuration = `${hours} giờ ${minutes} phút ${seconds} giây`;

        return { totalChapters, totalLessons, formattedDuration }; // Trả về tổng số chương, tổng số bài học và thời gian định dạng
    }, [groupedChapters]);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetail(courseId)); // Lấy chi tiết khóa học
            dispatch(fetchLessonsByCourseId(courseId)); // Lấy danh sách bài học của khóa học
            dispatch(fetchChaptersByCourseId(courseId)); // Lấy danh sách chương của khóa học
            if (chapterId) {
                dispatch(fetchLessonsBychapterId(chapterId)); // Lấy danh sách bài học của chương cụ thể nếu có
            }
        }
    }, [dispatch, courseId, chapterId]);

    useEffect(() => {
        setEditableCourse({ ...courseDetail }); // Cập nhật thông tin khóa học có thể chỉnh sửa khi chi tiết khóa học thay đổi
    }, [courseDetail]);

    useEffect(() => {
        if (!chapters || !Array.isArray(chapters)) return; // Kiểm tra chapters trước khi sử dụng

        const sortedChapters = [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber); // Sắp xếp các chương theo số thứ tự
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
                    chaptersMap[lesson.chapterId].lessons.push(lesson); // Thêm bài học vào chương tương ứng
                }
            });
        }

        setGroupedChapters(Object.values(chaptersMap)); // Cập nhật state groupedChapters
    }, [lessons, chapters]);

    console.log('Grouped Chapters:', groupedChapters); // In ra các chương đã nhóm

    const onDragEnd = async (result) => {
        if (!editMode) {
            return; // Không cho phép kéo thả nếu không ở chế độ chỉnh sửa
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
    };

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
        if (user.uid === courseDetail.authorId) {
            navigate(`lesson/${lessonId}`);
        }
        else if (user.role === "admin") {
            navigate(`lesson/${lessonId}`);

        }
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

    const handlePriceInput = (e) => {
        const regex = /^[0-9]*$/; // Chỉ cho phép số
        if (!regex.test(e.target.textContent)) {
            e.preventDefault();
        }
    };

    const handlePriceChange = (e) => {
        const price = e.target.textContent.replace(/\D/g, ''); // Lọc ra chỉ số từ nội dung nhập
        setEditableCourse({ ...editableCourse, price: price });
    };

    if (loadingCourse || loadingLessons || loadingChapters) {
        return <div>Đang tải...</div>;
    }

    if (!courseDetail.isReleased && user.uid !== courseDetail.authorId && user.role !== 'admin') {
        return <div>Khóa học này chưa được công bố.</div>; // Hoặc điều hướng về trang khác
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

    const handleSaveChanges = () => {
        const updatedCourse = {
            ...editableCourse,
            updatedAt: new Date().toISOString() // Cập nhật ngày hiện tại
        };
        dispatch(updateCourseDetails(updatedCourse));
        setEditMode(false);
    };

    const handleCancelEdit = () => {
        setEditableCourse(courseDetail);
        setEditMode(false);
    };

    const handleChange = (value, field) => {
        setEditableCourse(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <nav className={styles.navbar}>
                <h1 className={styles.courseTitle}>{courseDetail.name}</h1>
            </nav>
            <div className={styles.courseSidebar}>
                <div className={styles.coursePreview}>
                    {courseDetail.img && <img src={courseDetail.img} alt="Hình ảnh khóa học" className={styles.courseImage} />}
                </div>
                <div className={styles.coursePurchase}>
                    {!isCoursePurchased && (
                        <>
                            <div
                                className={`${styles.coursePrice} ${editMode ? styles.editable : ''}`}
                                contentEditable={editMode}
                                onInput={(e) => handlePriceInput(e)}
                                onBlur={(e) => handlePriceChange(e)}
                                dangerouslySetInnerHTML={{ __html: `$${courseDetail.price}` }}
                            />
                            <button className={styles.addToCartButton} onClick={handleAddToCart}>Add to Cart</button>
                            <button className={styles.buyNowButton} onClick={() => handleBuyCourse(courseDetail)}>Buy Now</button>
                        </>
                    )}
                    {isCoursePurchased && (
                        <div className={styles.purchasedMessage}>Bạn đã mua khóa học này.</div>
                    )}
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
                        <span className={styles.rating}>({courseDetail.rating ? courseDetail.rating.toFixed(1) : 'N/A'})</span>
                        {courseDetail.rating && renderStars(courseDetail.rating)}
                        <span>({courseDetail.numberOfReviews} xếp hạng)</span>
                        <span className={styles.enrollment}>{courseDetail.numberOfStudents} học viên</span>
                    </div>
                    <div className={styles.instructorInfo}>
                        Được tạo bởi <Link to={`/profileinstructor/${courseDetail.authorId}`}>{courseDetail?.author || 'Giảng viên'}</Link>

                        <span className={styles.updateDate}>Lần cập nhật gần đây nhất {formatDate(courseDetail.updatedAt)}</span>
                        <span
                            className={`${styles.language} ${editMode ? styles.editable : ''}`}
                            contentEditable={editMode}
                            onBlur={(e) => setEditableCourse({ ...editableCourse, language: e.target.textContent })}
                            dangerouslySetInnerHTML={{ __html: courseDetail.language }}
                        />
                        {user.uid === courseDetail.authorId && (
                            <div className={styles.editPrompt}>
                                Bạn là chủ khóa học, vào mode chỉnh sửa?
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
                        {editMode ? (
                            <ReactQuill theme="snow" value={editableCourse.description || ''} onChange={(value) => handleChange(value, 'description')} />
                        ) : (
                            <div className={styles.description} dangerouslySetInnerHTML={{ __html: editableCourse.description }} />
                        )}
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
                    <DragDropContext onDragEnd={onDragEnd}>
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
                                                                        <li key={lesson._id} className={styles.lesson} data-tip={lesson.description}>
                                                                            <span onClick={() => handleLessonClick(lesson._id)} className={styles.lessonTitle}>{lesson.title}</span>
                                                                            <div className={styles.left}>
                                                                                <span className={styles.lessonDuration}>{formatDurationFromSeconds(lesson.duration)}</span>
                                                                                <div className={styles.icon}>
                                                                                    <FontAwesomeIcon className={styles.deleteLesson} icon={faTrashAlt} onClick={() => handleDeleteLesson(lesson._id)} />
                                                                                </div>
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
                    {editMode ? (
                        <ReactQuill theme="snow" value={editableCourse.request || ''} onChange={(value) => handleChange(value, 'request')} />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: editableCourse.request }} />
                    )}
                </div>
                <div className={styles.description}>
                    <h3>Mô tả</h3>
                    {editMode ? (
                        <ReactQuill theme="snow" value={editableCourse.describe || ''} onChange={(value) => handleChange(value, 'describe')} />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: editableCourse.describe }} />
                    )}
                </div>
            </div>
        </>
    );
};

export default CourseDetailPage;
