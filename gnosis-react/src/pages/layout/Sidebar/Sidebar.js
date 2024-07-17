import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import logoImage from '../../../assets/images/Gnosis.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logout } from '../../../redux/action/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { faHome, faBook, faUser, faShoppingCart, faCog, faSignOut, faBars } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    // Tạo một tham chiếu đến sidebar để có thể truy cập DOM của nó
    const sidebarRef = useRef(null);

    // Lấy vai trò của người dùng từ Redux store
    const role = useSelector(state => state.auth.role);

    // Lấy thông tin người dùng từ Redux store
    const { user } = useSelector(state => state.auth);
    const { name, picture } = user || {};

    // Khởi tạo hook useNavigate để điều hướng trang
    const navigate = useNavigate();

    // Khởi tạo hook useDispatch để gửi action lên Redux store
    const dispatch = useDispatch();

    // Khởi tạo state để quản lý trạng thái mở/đóng của sidebar
    const [isOpen, setIsOpen] = useState(true);

    // Khởi tạo state để lưu giá trị tìm kiếm của người dùng
    const [searchTerm, setSearchTerm] = useState('');

    // Hàm chuyển đổi trạng thái mở/đóng của sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Hàm xử lý khi người dùng đăng xuất
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Hàm xử lý khi giá trị tìm kiếm thay đổi
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // useEffect để cập nhật vị trí của sidebar khi cuộn trang
    useEffect(() => {
        const sidebar = sidebarRef.current;
        const handleScroll = () => {
            if (sidebar) {
                sidebar.style.top = `${window.scrollY}px`;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Danh sách các mục menu
    const menuItems = [
        { to: "/home", icon: faHome, label: "HOME" },
        { to: "/browsecourse", icon: faBook, label: "BROWSE COURSES" },
        { to: "/profile", icon: faUser, label: "PROFILE" },
        { to: "/cart", icon: faShoppingCart, label: "CART" },
    ];

    // Thêm mục ADMIN vào menu nếu người dùng là admin
    if (role === 'admin') {
        menuItems.push({ to: "/admin", icon: faUser, label: "ADMIN" });
    }

    // Thêm mục INSTRUCTOR vào menu nếu người dùng là giảng viên
    if (role === 'instructor') {
        menuItems.push({ to: "/instructor", icon: faUser, label: "INSTRUCTOR" });
    }

    // Lọc các mục menu dựa trên giá trị tìm kiếm
    const filteredMenuItems = menuItems.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={isOpen ? styles.sidebar : `${styles.sidebar} ${styles.collapsed}`}>
            <button className={styles.toggleButton} onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} />
            </button>
            <div className={styles.logo}>
                <img src={logoImage} alt="GNOSIS Logo" className={styles.logo} />
            </div>
            <div className={styles.userInfo}>
                <img src={picture} alt={`Avatar of ${name}`} className={styles.avatar} />
                <p className={styles.name}> {name}</p>
            </div>
            <div className={styles.search}>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className={styles.menu}>
                {filteredMenuItems.map((item, index) => (
                    <Link to={item.to} className={styles.menuItem} key={index}>
                        <FontAwesomeIcon icon={item.icon} /> {item.label}
                    </Link>
                ))}
                <Link to="/login" className={styles.menuItem} onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOut} /> LOGOUT
                </Link>
                <Link to="/settings" className={styles.Seting}><FontAwesomeIcon icon={faCog} /> SETTINGS</Link>
            </div>
        </div>
    );
};

export default Sidebar;
