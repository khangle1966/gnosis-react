// HomeLayout.js
import React from 'react';
import Sidebar from './Sidebar/Sidebar'; // Đảm bảo đường dẫn đúng
import { Outlet } from 'react-router-dom'; // Cho phép render các nested routes
import styles from './Layout.module.scss'; // Styles cho HomeLayout

const HomeLayout = () => {
    return (
        <div className={styles.homeLayout}>
            <Sidebar />
            <div className={styles.content}>
                <Outlet /> {/* Nội dung của nested routes sẽ được render ở đây */}
            </div>
        </div>
    );
};

export default HomeLayout;
