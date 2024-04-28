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
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
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
                <input type="text" placeholder="Search" />
            </div>

            <div className={styles.menu}>
                <Link to="/welcome  " className={styles.menuItem}><FontAwesomeIcon icon={faHome} /> HOME</Link>
                <Link to="/browsecourse" className={styles.menuItem}><FontAwesomeIcon icon={faBook} /> BROWSE COURSES</Link>
                <Link to="/profile" className={styles.menuItem}><FontAwesomeIcon icon={faUser} /> PROFILE</Link>
                <Link to="/cart" className={styles.menuItem}><FontAwesomeIcon icon={faShoppingCart} /> CART</Link>
                {/* Asumming you have admin routes */}
                {role === 'admin' && (
                    <Link to="/admin" className={styles.menuItem}><FontAwesomeIcon icon={faUser} /> ADMIN</Link>
                )}
                {role === 'instructor' && (
                    <Link to="/instructor" className={styles.menuItem}><FontAwesomeIcon icon={faUser} /> INSTRUCTOR</Link>
                )}
                <Link to="/login" className={styles.menuItem} onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOut} /> LOGOUT
                </Link>
                <Link to="/settings" className={styles.Seting}><FontAwesomeIcon icon={faCog} /> SETTINGS</Link>

            </div>
        </div>
    );
};

export default Sidebar;
