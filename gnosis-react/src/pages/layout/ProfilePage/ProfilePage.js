import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile2 } from '../../../redux/action/profileActions';
import { logout } from '../../../redux/action/authActions';
import { fetchUserCourses } from '../../../redux/action/courseActions';
import { uploadAvatar } from '../../../redux/action/userGoogleActions';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import CSS cho ReactQuill
import styles from './ProfilePage.module.scss';
const ProfilePage = () => {
    // Sử dụng hook useDispatch để gửi action lên Redux store
    const dispatch = useDispatch();
    // Sử dụng hook useNavigate để điều hướng trang
    const navigate = useNavigate();
    // Lấy thông tin người dùng từ Redux store
    const { user } = useSelector(state => state.auth);
    // Lấy thông tin profile từ Redux store
    const { profile } = useSelector(state => state.profile);
    // Khởi tạo state để lưu thông báo
    const [notification, setNotification] = useState({ show: false, message: '' });
    // Lấy thông tin các khóa học của người dùng từ Redux store
    const { userCourses, loading, error } = useSelector(state => state.course);
    // Kiểm tra trạng thái đăng nhập của người dùng
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    // Khởi tạo state để lưu thông tin form
    const [formData, setFormData] = useState({
        userName: '',
        gender: 'male',
        country: '',
        bio: '',
        description: '' // Thêm trường mô tả (Description)
    });

    // Khởi tạo state để lưu hình ảnh người dùng
    const [userPicture, setUserPicture] = useState(user?.picture);
    const fileInputRef = useRef(null);

    // Khởi tạo state để quản lý số lượng khóa học hiển thị ban đầu
    const [visibleCourses, setVisibleCourses] = useState(3);

    // useEffect để cập nhật formData khi profile thay đổi
    useEffect(() => {
        if (profile) {
            setFormData({
                userName: profile.userName || '',
                gender: profile.gender || 'male',
                country: profile.country || '',
                bio: profile.bio || '',
                description: profile.description || '' // Cập nhật giá trị mô tả (Description)
            });
        }
    }, [profile]);

    // useEffect để fetch thông tin profile khi component mount
    useEffect(() => {
        dispatch(fetchProfile(user.uid));
    }, [dispatch, user.uid]);

    // useEffect để kiểm tra trạng thái đăng nhập và fetch các khóa học của người dùng
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else if (profile && profile.courses) {
            dispatch(fetchUserCourses(profile.courses));
        }
    }, [isLoggedIn, profile, dispatch, navigate]);

    // useEffect để cập nhật hình ảnh người dùng khi thông tin người dùng thay đổi
    useEffect(() => {
        setUserPicture(user?.picture);
    }, [user]);

    // Hàm xử lý khi có thay đổi trong các input field
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        });
    };

    // Hàm xử lý khi có thay đổi trong input mô tả (description)
    const handleDescriptionChange = (value) => {
        setFormData({
            ...formData,
            description: value
        });
    };

    // Hàm xử lý khi người dùng nhấp vào avatar
    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    // Hàm xử lý khi người dùng thay đổi avatar
    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setUserPicture(URL.createObjectURL(file));
            await dispatch(uploadAvatar(file, user.uid));
        }
    };

    // Hàm rút gọn mô tả (description) nếu dài quá 50 ký tự
    const truncateDescription = (description) => {
        if (!description) return '';
        return description.length > 50 ? description.substring(0, 50) + '...' : description;
    };

    // Hàm rút gọn tên khóa học nếu dài quá 50 ký tự
    const truncateNameCourse = (name) => {
        if (!name) return '';
        return name.length > 50 ? name.substring(0, 50) + '...' : name;
    };

    // Hàm xử lý khi người dùng submit form
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(updateProfile2(formData, user.uid));
            setNotification({ show: true, message: `Profile "${user.uid}" updated successfully!` });
        } catch (err) {
            setNotification({ show: false, message: 'Failed to update profile. Please try again.' });
        }
        setTimeout(() => {
            setNotification({ show: false, message: '' });
        }, 3000);
    };

    // Hàm xử lý khi người dùng nhấp vào mô tả khóa học
    const handleDescriptionClick = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    // Hàm xử lý khi người dùng đăng xuất
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Hàm xử lý khi người dùng nhấp vào nút "Load More"
    const handleLoadMore = () => {
        setVisibleCourses(visibleCourses + 3); // Hiển thị thêm 3 khóa học khi nhấp vào nút "Load More"
    };

    // Hiển thị thông báo "Loading..." nếu đang tải dữ liệu
    if (loading) return <p>Loading...</p>;
    // Hiển thị thông báo lỗi nếu có lỗi xảy ra
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.profilePage}>
            {notification.show && (
                <div className={styles.notification}>
                    {notification.message}
                </div>
            )}
            <div className={styles.breadcrumbs}>Home &gt;&gt; Profile</div>
            <header className={styles.profileHeader}>
                <h1>Profile</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
                    Log out
                </button>
            </header>
            <main className={styles.profileContent}>
                <section className={styles.leftColumn}>
                    <img src={userPicture} alt={`Avatar of ${user?.name}`} className={styles.avatar} onClick={handleAvatarClick} />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                    />
                    <h2 className={styles.userName}>{profile.userName}</h2>
                    <p className={styles.userEmail}>{user?.email}</p>
                </section>
                <section className={styles.middleColumn}>
                    <h2>Edit your Personal Settings</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="userName">User Name</label>
                                <input type="text" id="userName" value={formData.userName} onChange={handleChange} placeholder="User Name..." />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="gender">Gender</label>
                                <select id="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.inputGroupSingle}>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="Email..." value={user?.email} disabled />
                        </div>
                        <div className={styles.inputGroupSingle}>
                            <label htmlFor="country">Country</label>
                            <select id="country" value={formData.country} onChange={handleChange}>
                                <option value="">Select a country...</option>
                                <option value="Vietnam">Việt Nam</option>
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Australia">Australia</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="Japan">Japan</option>
                                <option value="South Korea">South Korea</option>
                                <option value="China">China</option>
                                <option value="Singapore">Singapore</option>
                                <option value="New Zealand">New Zealand</option>
                            </select>
                        </div>
                        <div className={styles.inputGroupSingle}>
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio" value={formData.bio} onChange={handleChange} placeholder="Describe yourself..."></textarea>
                        </div>
                        {user?.role === 'instructor' && (
                            <div className={styles.inputGroupSingle}>
                                <label htmlFor="description">Description for Instructors</label>
                                <ReactQuill value={formData.description} onChange={handleDescriptionChange} />
                            </div>
                        )}
                        <button type="submit" className={styles.updateProfileButton}>Update Profile</button>
                    </form>
                </section>
                <section className={styles.rightColumn}>
                    <h2 className={styles.coursesHeader}>Courses</h2>
                    {loading && <div>Loading courses...</div>}
                    {error && <div>Error fetching courses: {error.message}</div>}
                    {userCourses && userCourses.slice(0, visibleCourses).map(course => (
                        <div className={styles.courseCard} key={course._id}>
                            <div className={styles.courseImageWrapper}>
                                <img src={course.img} alt={course.name} />
                            </div>
                            <div className={styles.courseContent}>
                                <h3 className={styles.courseTitle}>{truncateNameCourse(course.name)}</h3>
                                <p className={styles.courseSubtitle}>{truncateDescription(course.description)}</p>
                                <div className={styles.courseButtons}>
                                    <button onClick={() => handleDescriptionClick(course._id)}>Start</button>
                                    <button>Cancel</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {userCourses && visibleCourses < userCourses.length && (
                        <button onClick={handleLoadMore} className={styles.loadMoreButton}>Loading more...</button>
                    )}
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
