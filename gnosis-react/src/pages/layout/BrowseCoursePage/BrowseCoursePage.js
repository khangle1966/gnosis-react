// Import các thư viện và hành động cần thiết
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../../redux/action/courseActions';
import { fetchProfile } from '../../../redux/action/profileActions'; // Import fetchProfile action
import { addToCart } from '../../../redux/action/cartActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './BrowseCoursePage.module.scss'; // Import các lớp CSS từ file SCSS

const BrowseCoursePage = () => {
    const navigate = useNavigate(); // Khởi tạo hook navigate để điều hướng
    const dispatch = useDispatch(); // Khởi tạo hook dispatch để gửi hành động đến Redux store
    const { courses, loading, error } = useSelector(state => state.course); // Lấy trạng thái courses, loading và error từ Redux store
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Kiểm tra trạng thái đăng nhập từ Redux store
    const { profile, loading: profileLoading } = useSelector(state => state.profile); // Lấy trạng thái profile và profileLoading từ Redux store

    const [notification, setNotification] = useState({ show: false, message: '' }); // State thông báo khi thêm khóa học vào giỏ hàng
    const [activeCategory, setActiveCategory] = useState('All'); // State cho danh mục hiện tại
    const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
    const coursesPerPage = 9; // Số khóa học trên mỗi trang
    const [searchTerm, setSearchTerm] = useState(''); // State cho từ khóa tìm kiếm
    const [filteredCourses, setFilteredCourses] = useState([]); // State cho các khóa học đã lọc
    const [ownedCourses, setOwnedCourses] = useState([]); // State cho các khóa học đã sở hữu

    // useEffect kiểm tra đăng nhập và lấy danh sách khóa học, profile
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login'); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
        } else {
            dispatch(fetchCourses()); // Gửi hành động lấy danh sách khóa học
            if (profile && profile.courses) {
                const ownedCourseIds = profile.courses.map(course => course._id); // Lấy danh sách khóa học đã sở hữu từ profile
                setOwnedCourses(ownedCourseIds); // Cập nhật state ownedCourses
            }
        }
    }, [isLoggedIn, navigate, dispatch, profile]); // Thêm profile vào dependency array để cập nhật khi profile thay đổi

    // useEffect để lấy thông tin profile khi đăng nhập
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchProfile(profile.id)); // Gửi hành động lấy thông tin profile
        }
    }, [dispatch, isLoggedIn]);

    // useEffect để lọc các khóa học theo từ khóa tìm kiếm và danh mục
    useEffect(() => {
        const filtered = courses.filter(course =>
            course.isReleased && // Chỉ lấy các khóa học đã phát hành
            (activeCategory === 'All' || course.category === activeCategory) && // Lọc theo danh mục
            ((course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase())) || // Lọc theo từ khóa tìm kiếm
                (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())))
        );
        setFilteredCourses(filtered); // Cập nhật state filteredCourses
    }, [courses, activeCategory, searchTerm]);

    // Hàm xử lý thêm khóa học vào giỏ hàng
    const handleAddToCart = (course) => {
        dispatch(addToCart(course)); // Gửi hành động thêm khóa học vào giỏ hàng
        setNotification({ show: true, message: `Added "${course.name}" to cart.` }); // Hiển thị thông báo
        setTimeout(() => {
            setNotification({ show: false, message: '' }); // Tắt thông báo sau 3 giây
        }, 3000);
    };

    // Hàm xử lý khi nhấp vào mô tả khóa học
    const handleDescriptionClick = (courseId) => {
        navigate(`/course/${courseId}`); // Điều hướng đến trang chi tiết khóa học
    };

    // Hàm rút ngắn mô tả khóa học
    const truncateDescription = (description) => {
        if (!description) return '';
        return description.length > 50 ? description.substring(0, 50) + '...' : description;
    };

    // Hàm rút ngắn tên khóa học
    const truncateNameCourse = (name) => {
        if (!name) return '';
        return name.length > 50 ? name.substring(0, 50) + '...' : name;
    };

    // Hàm xử lý khi chọn danh mục
    const handleCategoryClick = (category) => {
        setActiveCategory(category); // Cập nhật danh mục hiện tại
        setCurrentPage(1); // Đặt lại trang hiện tại về trang 1
    };

    // Tính toán chỉ số của khóa học đầu tiên và cuối cùng trên mỗi trang
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse); // Lấy danh sách khóa học trên trang hiện tại

    // Hàm xử lý khi chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Tạo danh sách số trang
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCourses.length / coursesPerPage); i++) {
        pageNumbers.push(i);
    }

    // Hàm render số trang
    const renderPageNumbers = () => {
        const totalPages = pageNumbers.length;
        const maxPagesToShow = 5; // Số lượng trang tối đa để hiển thị
        const pages = [];

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);

            if (currentPage <= 3) {
                endPage = maxPagesToShow;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (startPage > 1) {
                if (startPage > 2) {
                    pages.unshift('...');
                }
                pages.unshift(1);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }

        return pages.map((number, index) =>
            number === '...' ? (
                <span key={index} className={styles.ellipsis}>{number}</span>
            ) : (
                <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={currentPage === number ? styles.active : ''}
                >
                    {number}
                </button>
            )
        );
    };

    // Kiểm tra xem khóa học đã sở hữu chưa
    const isCourseOwned = (courseId) => {
        return ownedCourses.includes(courseId);
    };

    // Hiển thị khi dữ liệu đang tải
    if (loading || profileLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.homePageContent}>
            {notification.show && (
                <div className={styles.notification}>
                    {notification.message}
                </div>
            )}
            <div className={styles.searchbarandnreadcrumbs}>
                <div className={styles.breadcrumbs}>Home &gt; Browse</div>
                <div className={styles.searchBar}>
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Thêm sự kiện onChange
                    />
                </div>
            </div>
            <div className={styles.promotions}>
                <span>70% off all courses today</span>
                <span>70% off all courses today</span>
                <span>70% off all courses today</span>
                <span>70% off all courses today</span>
                <span>70% off all courses today</span>
            </div>
            <div className={styles.filterBar}>
                <button className={activeCategory === 'All' ? styles.active : ''} onClick={() => handleCategoryClick('All')}>All</button>
                <button className={activeCategory === 'Popular' ? styles.active : ''} onClick={() => handleCategoryClick('Popular')}>Popular</button>
                <button className={activeCategory === 'Web Developer' ? styles.active : ''} onClick={() => handleCategoryClick('Web Developer')}>Web Developer</button>
                <button className={activeCategory === 'Computer Science' ? styles.active : ''} onClick={() => handleCategoryClick('Computer Science')}>Computer Science</button>
                <button className={activeCategory === 'English' ? styles.active : ''} onClick={() => handleCategoryClick('English')}>English</button>
                <button className={activeCategory === 'Music' ? styles.active : ''} onClick={() => handleCategoryClick('Music')}>Music</button>
                <button className={activeCategory === 'Cook' ? styles.active : ''} onClick={() => handleCategoryClick('Cook')}>Cook</button>
            </div>
            <div className={styles.courseGrid}>
                {loading && <div>Loading courses...</div>}
                {error && <div>Error fetching courses: {error.message}</div>}
                {currentCourses.map((course) => (
                    <div key={course._id} className={styles.courseCard}>
                        <div className={styles.courseImageWrapper}>
                            <img src={course.img} alt={course.name} />
                        </div>
                        <div className={styles.courseDetails}>
                            <h3>{truncateNameCourse(course.name)}</h3>
                            <p dangerouslySetInnerHTML={{ __html: truncateDescription(course.description) }}></p>
                            <div className={styles.courseActions}>
                                <button
                                    onClick={() => handleAddToCart(course)}
                                    disabled={isCourseOwned(course._id)}
                                    style={{ backgroundColor: isCourseOwned(course._id) ? '#ccc' : '' }}
                                >
                                    Add to Cart
                                </button>
                                <button onClick={() => handleDescriptionClick(course._id)}>Description</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.pagination}>
                <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                {renderPageNumbers()}
                <button
                    onClick={() => paginate(currentPage < pageNumbers.length ? currentPage + 1 : pageNumbers.length)}
                    disabled={currentPage === pageNumbers.length}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default BrowseCoursePage;
