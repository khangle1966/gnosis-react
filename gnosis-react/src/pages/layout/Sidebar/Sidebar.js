import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.scss'; // SCSS module cho styles
import logoImage from '../../../assets/images/Gnosis.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logout } from '../../../redux/action/authActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { faHome, faBook, faUser, faShoppingCart, faCog, faSignOut, faBars } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const sidebarRef = useRef(null);
    const role = useSelector(state => state.auth.role);
    console.log('Role in store:', role);
    const { user } = useSelector(state => state.auth);
    const { name, picture } = user || {};
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    useEffect(() => {
        const sidebar = sidebarRef.current;
        // Đảm bảo sidebar tự động cuộn khi cuộn trang
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
    const menuItems = [
        { to: "/home", icon: faHome, label: "HOME" },
        { to: "/browsecourse", icon: faBook, label: "BROWSE COURSES" },
        { to: "/profile", icon: faUser, label: "PROFILE" },
        { to: "/cart", icon: faShoppingCart, label: "CART" },
    ];

    if (role === 'admin') {
        menuItems.push({ to: "/admin", icon: faUser, label: "ADMIN" });
    }

    if (role === 'instructor') {
        menuItems.push({ to: "/instructor", icon: faUser, label: "INSTRUCTOR" });
    }

    // Lọc các liên kết dựa trên giá trị tìm kiếm
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
                <p>Hello, {name}</p>
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
