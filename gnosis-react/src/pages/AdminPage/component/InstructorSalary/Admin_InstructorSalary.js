import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors } from '../../../../redux/action/adminActions';
import { fetchInstructorSalaryById, fetchInstructorsSalary, fetchAdminSalary } from '../../../../redux/action/salaryActions';
import { Box, Typography, Card, CardContent, Grid, Autocomplete, TextField } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import styles from './Admin_InstructorSalary.module.scss';

const Admin_InstructorSalary = () => {
    const dispatch = useDispatch();
    const instructors = useSelector(state => state.admin.instructors);
    const instructorSalary = useSelector(state => state.salary.instructorSalary);
    const adminSalary = useSelector(state => state.salary.adminSalary);
    const instructorsSalary = useSelector(state => state.salary.instructorsSalary);
    const loading = useSelector(state => state.salary.loading);
    const error = useSelector(state => state.salary.error);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const years = Array.from(new Set(instructorSalary.map(salary => salary.year)));

    useEffect(() => {
        dispatch(fetchInstructors());
        dispatch(fetchInstructorsSalary());
        dispatch(fetchAdminSalary());
    }, [dispatch]);

    const handleInstructorChange = (event, newValue) => {
        setSelectedInstructor(newValue);
        if (newValue) {
            dispatch(fetchInstructorSalaryById(newValue.uid));
        }
    };

    const handleYearChange = (event, newValue) => {
        setSelectedYear(newValue);
    };

    const getFormattedData = () => {
        const data = Array.from({ length: 12 }, (_, index) => ({ month: index + 1, total: 0 }));
        instructorSalary
            .filter(salary => salary.year === selectedYear)
            .forEach(salary => {
                data[salary.month - 1].total = salary.total;
            });
        return data;
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const getMaxYAxis = (data) => {
        const maxValue = Math.max(...data.map(item => item.total));
        return maxValue + maxValue * 0.1; // Tăng thêm 10% giá trị lớn nhất
    };

    return (
        <div className={styles.adminPage}>
            <Typography variant="h4" gutterBottom>
                Quản lý lương giảng viên
            </Typography>
            <Box className={styles.separator}>
                <Typography variant="body1" className={styles.separatorText}>
                    Quản lý lương giảng viên
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card className={styles.primaryCard}>
                        <CardContent className={styles.cardContent}>
                            <PeopleIcon className={styles.icon} />
                            <Typography variant="h5" component="div" className={styles.cardTitle}>
                                Lương giảng viên
                            </Typography>
                            <Typography variant="h4" className={styles.cardValue}>
                                {loading ? 'Loading...' : formatCurrency(instructorsSalary.reduce((acc, curr) => acc + curr.total, 0))}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className={styles.warningCard}>
                        <CardContent className={styles.cardContent}>
                            <BookIcon className={styles.icon} />
                            <Typography variant="h5" component="div" className={styles.cardTitle}>
                                Lợi nhuận của Gnosis
                            </Typography>
                            <Typography variant="h4" className={styles.cardValue}>
                                {loading ? 'Loading...' : formatCurrency(adminSalary.reduce((acc, curr) => acc + curr.total, 0))}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Autocomplete
                        options={instructors}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="Chọn giảng viên" variant="outlined" />}
                        value={selectedInstructor}
                        onChange={handleInstructorChange}
                        className={styles.autocomplete}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Autocomplete
                        options={years}
                        getOptionLabel={(option) => option.toString()}
                        renderInput={(params) => <TextField {...params} label="Chọn năm" variant="outlined" />}
                        value={selectedYear}
                        onChange={handleYearChange}
                        className={styles.autocomplete}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Card className={styles.chartCard}>
                        <CardContent className={styles.cardContent}>
                            <Typography variant="h5" component="div" className={styles.chartTitle}>
                                Biểu đồ lương giảng viên: {selectedInstructor ? selectedInstructor.name : 'Chưa chọn giảng viên'}
                            </Typography>
                            {loading ? (
                                <Typography>Đang tải...</Typography>
                            ) : error ? (
                                <Typography>Error: {error.message}</Typography>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={getFormattedData()} margin={{ top: 10, right: 30, left: 20, bottom: 10 }} className={styles.chart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis domain={[0, getMaxYAxis(getFormattedData())]} tickFormatter={formatCurrency} />
                                        <Tooltip formatter={formatCurrency} />
                                        <Legend verticalAlign="top" height={36} />
                                        <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} animationDuration={500} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Admin_InstructorSalary;
