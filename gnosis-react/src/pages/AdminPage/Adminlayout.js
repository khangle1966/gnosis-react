import React from 'react';
import AdminSidebar from './component/Sidebar/AdminSidebar'; // Đảm bảo đường dẫn đúng
import { Outlet } from 'react-router-dom'; // Cho phép render các nested routes
import styles from './Adminlayout.module.scss'; // Styles cho HomeLayout

const Adminlayout = () => {
    return (
        <div className={styles.homeLayout}>
            <AdminSidebar />
            <div className={styles.content}>
                <Outlet /> {/* Nội dung của nested routes sẽ được render ở đây */}
            </div>
        </div>
    );
};

export default Adminlayout;
