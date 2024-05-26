import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchOrders, fetchInstructors, fetchMonthlyUserData, fetchMonthlyUsergoogleData, fetchMonthlyCourseData, fetchMonthlyRevenueData } from '../../redux/action/adminActions';
import { fetchCourses } from '../../redux/action/courseActions';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SchoolIcon from '@mui/icons-material/School';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import styles from './AdminPage.module.scss';

const AdminPage = () => {
    const dispatch = useDispatch();

    const totalUsers = useSelector(state => state.admin.users ? state.admin.users : 0);
    const totalCourses = useSelector(state => state.course.courses.length);
    const totalOrders = useSelector(state => state.admin.orders ? state.admin.orders.length : 0);
    const totalInstructors = useSelector(state => state.admin.instructors ? state.admin.instructors.length : 0);
    const userRegistrationData = useSelector(state => state.admin.monthlyUserData || []);
    const usergoogleRegistrationData = useSelector(state => state.admin.monthlyUsergoogleData || []);
    const courseEnrollmentData = useSelector(state => state.admin.monthlyCourseData || []);
    const revenueData = useSelector(state => state.admin.monthlyRevenueData || []);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchCourses());
        dispatch(fetchOrders());
        dispatch(fetchInstructors());
        dispatch(fetchMonthlyUserData());
        dispatch(fetchMonthlyUsergoogleData());
        dispatch(fetchMonthlyCourseData());
        dispatch(fetchMonthlyRevenueData());
    }, [dispatch]);

    console.log('User Registration Data:', userRegistrationData);
    console.log('Usergoogle Registration Data:', usergoogleRegistrationData);

    // Chuyển đổi userRegistrationData để phù hợp với cấu trúc data của AreaChart
    const formattedUserRegistrationData = userRegistrationData.map(data => ({
        month: data.month,
        count: data.userCount,
    }));

    console.log('Formatted User Registration Data:', formattedUserRegistrationData);

    return (
        <div className={styles.adminPage}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Box className={styles.separator}>
                <Typography variant="body1" className={styles.separatorText}>
                    Dashboard
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Card className={styles.primaryCard}>
                        <CardContent className={styles.cardContent}>
                            <PeopleIcon fontSize="large" className={styles.icon} />
                            <div>
                                <Typography variant="h5" component="div">
                                    Tổng số người dùng
                                </Typography>
                                <Typography variant="h4">{totalUsers}</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card className={styles.warningCard}>
                        <CardContent className={styles.cardContent}>
                            <BookIcon fontSize="large" className={styles.icon} />
                            <div>
                                <Typography variant="h5" component="div">
                                    Tổng số khóa học
                                </Typography>
                                <Typography variant="h4">{totalCourses}</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card className={styles.successCard}>
                        <CardContent className={styles.cardContent}>
                            <ShoppingCartIcon fontSize="large" className={styles.icon} />
                            <div>
                                <Typography variant="h5" component="div">
                                    Tổng số đơn hàng
                                </Typography>
                                <Typography variant="h4">{totalOrders}</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card className={styles.dangerCard}>
                        <CardContent className={styles.cardContent}>
                            <SchoolIcon fontSize="large" className={styles.icon} />
                            <div>
                                <Typography variant="h5" component="div">
                                    Tổng số giảng viên
                                </Typography>
                                <Typography variant="h4">{totalInstructors}</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={3} className={styles.chartsContainer}>
                <Grid item xs={12} md={6}>
                    <Card className={styles.chartCard}>
                        <CardContent>
                            <Typography variant="h6" component="div" className={styles.chartTitle}>
                                Xu hướng đăng ký người dùng
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={formattedUserRegistrationData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className={styles.chartCard}>
                        <CardContent>
                            <Typography variant="h6" component="div" className={styles.chartTitle}>
                                Xu hướng đăng ký usergoogle
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={usergoogleRegistrationData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#82ca9d" fill="#82ca9d" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>


            </Grid>
        </div>
    );
};

export default AdminPage;
