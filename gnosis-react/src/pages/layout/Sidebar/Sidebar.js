import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.scss'; // SCSS module cho styles
import logoImage from '../../../assets/images/Gnosis.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logout } from '../../../redux/action/authActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { faHome, faBook, faUser, faShoppingCart, faCog, faSignOut } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const sidebarRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
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
        <div className={styles.sidebar}>
            <div className={styles.logo}>

                <img src={logoImage} alt="GNOSIS Logo" className={styles.logo} />

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
                <Link to="/admin" className={styles.menuItem}><FontAwesomeIcon icon={faUser} className={styles.FaAdminIcon} /> ADMIN</Link>
                <Link to="/login" className={styles.menuItem} onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOut} /> LOGOUT
                </Link>
                <Link to="/settings" className={styles.Seting}><FontAwesomeIcon icon={faCog} /> SETTINGS</Link>

            </div>
        </div>
    );
};

export default Sidebar;
