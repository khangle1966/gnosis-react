// HomeLayout.js
import React from 'react';
import SidebarNologin from './SidebarNologin/SidebarNologin'; // Đảm bảo đường dẫn đúng
import { Outlet } from 'react-router-dom'; // Cho phép render các nested routes
import styles from './Layout.module.scss'; // Styles cho HomeLayout

const HomeLayoutNologin = () => {
    return (
        <div className={styles.homeLayout}>
            <SidebarNologin />
            <div className={styles.content}>
                <Outlet /> {/* Nội dung của nested routes sẽ được render ở đây */}
            </div>

        </div>
    );
};

export default HomeLayoutNologin;
