import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchOrders, fetchInstructors, fetchMonthlyUserData, fetchMonthlyUsergoogleData, fetchMonthlyCourseData } from '../../redux/action/adminActions';
import { fetchCourses, approveCourse, deleteCourse } from '../../redux/action/courseActions';
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tabs, Tab, TablePagination, TextField } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SchoolIcon from '@mui/icons-material/School';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPage.module.scss';
import RevenueChart from './component/RevenueChart/RevenueChart';

const AdminPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const totalUsers = useSelector(state => state.admin.users ? state.admin.users : 0);
    const totalCourses = useSelector(state => state.course.courses.length);
    const totalOrders = useSelector(state => state.admin.orders ? state.admin.orders.length : 0);
    const totalInstructors = useSelector(state => state.admin.instructors ? state.admin.instructors.length : 0);
    const userRegistrationData = useSelector(state => state.admin.monthlyUserData || []);
    const usergoogleRegistrationData = useSelector(state => state.admin.monthlyUsergoogleData || []);
    const courses = useSelector(state => state.course.courses || []);
    const { user } = useSelector(state => state.auth);
    console.log("auth", user)
    const [tabIndex, setTabIndex] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/browsecourse');
        } else {
            dispatch(fetchUsers());
            dispatch(fetchCourses());
            dispatch(fetchOrders());
            dispatch(fetchInstructors());
            dispatch(fetchMonthlyUserData());
            dispatch(fetchMonthlyUsergoogleData());
            dispatch(fetchMonthlyCourseData());
        }
    }, [dispatch]);

    const handleApproveCourse = (courseId) => {
        dispatch(approveCourse(courseId));
    };

    const handleDeleteCourse = (courseId) => {
        dispatch(deleteCourse(courseId));
    };

    const filteredCourses = (isReleased) => {
        return courses.filter(course =>
            course.isReleased === isReleased &&
            (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course._id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formattedUserRegistrationData = userRegistrationData.map(data => ({
        month: data.month,
        count: data.userCount,
    }));
    const truncateDescription = (description) => {
        if (!description) return '';
        return description.length > 50 ? description.substring(0, 50) + '...' : description;
    };
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
                <Grid item xs={12}>
                    <RevenueChart />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className={styles.chartCard}>
                        <CardContent>
                            <Typography variant="h6" component="div" className={styles.chartTitle}>
                                Xu hướng đăng ký người dùng
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={formattedUserRegistrationData}>
                                    <defs>
                                        <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorUser)" />
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
                                    <defs>
                                        <linearGradient id="colorUserGoogle" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUserGoogle)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box className={styles.separator}>
                <Typography variant="body1" className={styles.separatorText}>
                    Quản lý khóa học
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Tabs value={tabIndex} onChange={handleTabChange} className={styles.tabs}>
                    <Tab label="Các khóa học chưa duyệt" />
                    <Tab label="Các khóa học đã duyệt" />
                </Tabs>
                <TextField
                    label="Tìm kiếm khóa học"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </Box>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Url</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCourses(tabIndex === 1).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                            <TableRow key={course._id}>
                                <TableCell>{course._id}</TableCell>
                                <TableCell>{course.name}</TableCell>
                                <TableCell> <p dangerouslySetInnerHTML={{ __html: truncateDescription(course.description) }}></p></TableCell>
                                <TableCell>{course.category}</TableCell>
                                <TableCell>{course.price}</TableCell>
                                <TableCell>{course.author}</TableCell>
                                <TableCell>
                                    <a href={`/course/${course._id}`}>{course.name}</a>
                                </TableCell>
                                <TableCell>
                                    {tabIndex === 0 ? (
                                        <>
                                            <Button onClick={() => handleApproveCourse(course._id)}>Duyệt</Button>
                                            <Button onClick={() => handleDeleteCourse(course._id)} color="secondary">Xóa</Button>
                                        </>
                                    ) : (
                                        <Button disabled>Đã duyệt</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredCourses(tabIndex === 1).length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
};

export default AdminPage;
