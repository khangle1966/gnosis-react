import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../../redux/action/courseActions';
import { addToCart } from '../../../redux/action/cartActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './BrowseCoursePage.module.scss';

const BrowseCoursePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courses, loading, error } = useSelector(state => state.course);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const [notification, setNotification] = useState({ show: false, message: '' });
    const [activeCategory, setActiveCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 9;
    const [searchTerm, setSearchTerm] = useState(''); // Thêm state cho từ khóa tìm kiếm
    const [filteredCourses, setFilteredCourses] = useState([]); // Thêm state cho các khóa học đã lọc

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            dispatch(fetchCourses());
        }
    }, [isLoggedIn, navigate, dispatch]);

    useEffect(() => {
        const filtered = courses.filter(course =>
            (activeCategory === 'All' || course.category === activeCategory) &&
            ((course.name && course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())))
        );
        setFilteredCourses(filtered);
    }, [courses, activeCategory, searchTerm]);

    const handleAddToCart = (course) => {
        dispatch(addToCart(course));
        setNotification({ show: true, message: `Added "${course.name}" to cart.` });
        setTimeout(() => {
            setNotification({ show: false, message: '' });
        }, 3000);
    };

    const handleDescriptionClick = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    const truncateDescription = (description) => {
        if (!description) return '';
        return description.length > 50 ? description.substring(0, 50) + '...' : description;
    };

    const truncateNameCourse = (name) => {
        if (!name) return '';
        return name.length > 50 ? name.substring(0, 50) + '...' : name;
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCourses.length / coursesPerPage); i++) {
        pageNumbers.push(i);
    }

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
                                <button onClick={() => handleAddToCart(course)}>Add to Cart</button>
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
