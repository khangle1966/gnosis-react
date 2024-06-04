import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors } from '../../../../redux/action/adminActions';
import { fetchInstructorSalaryById, fetchInstructorsSalary, fetchAdminSalary, fetchPayments, createPayment } from '../../../../redux/action/salaryActions';
import { Box, Typography, Card, CardContent, Grid, Autocomplete, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import CheckIcon from '@mui/icons-material/Check';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import styles from './Admin_InstructorSalary.module.scss';

const Admin_InstructorSalary = () => {
    const dispatch = useDispatch();
    const instructors = useSelector(state => state.admin.instructors);
    const adminSalary = useSelector(state => state.salary.adminSalary);
    const instructorsSalary = useSelector(state => state.salary.instructorsSalary);
    const payments = useSelector(state => state.salary.payments || []); // đảm bảo payments là mảng trống nếu không có dữ liệu
    const loading = useSelector(state => state.salary.loading);
    const error = useSelector(state => state.salary.error);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [salaries, setSalaries] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2019 }, (_, index) => 2020 + index);

    useEffect(() => {
        dispatch(fetchInstructors());
        dispatch(fetchInstructorsSalary());
        dispatch(fetchAdminSalary());
    }, [dispatch]);

    useEffect(() => {
        if (selectedInstructor) {
            dispatch(fetchPayments(selectedInstructor.uid, selectedYear));
        }
    }, [selectedInstructor, selectedYear, dispatch]);

    const handleInstructorChange = (event, newValue) => {
        console.log("Selected Instructor:", newValue);
        setSelectedInstructor(newValue);
        if (newValue) {
            dispatch(fetchInstructorSalaryById(newValue.uid)).then(data => {
                const salaryData = data.filter(salary => salary.year === selectedYear);
                setSalaries(salaryData);
                dispatch(fetchPayments(newValue.uid, selectedYear)); // Fetch payments when instructor changes
                console.log("Salary Data", salaryData);
            }).catch(error => {
                console.error(`Error fetching salary for instructor ${newValue.uid}:`, error);
            });
        }
    };

    const handleYearChange = (event, newValue) => {
        console.log("Selected Year:", newValue);
        setSelectedYear(newValue);
        if (selectedInstructor) {
            dispatch(fetchInstructorSalaryById(selectedInstructor.uid)).then(data => {
                const salaryData = data.filter(salary => salary.year === newValue);
                setSalaries(salaryData);
                dispatch(fetchPayments(selectedInstructor.uid, newValue)); // Fetch payments when year changes
                console.log("Salary Data", salaryData);
            }).catch(error => {
                console.error(`Error fetching salary for instructor ${selectedInstructor.uid}:`, error);
            });
        }
    };

    const getInstructorInfo = (instructorId) => {
        const instructor = instructors.find(inst => inst.uid === instructorId);
        return instructor ? {
            name: instructor.name,
            email: instructor.email,
            level: instructor.instructorLevel
        } : { name: '', email: '', level: '' };
    };

    const handleMonthSelect = (event, month) => {
        if (event.target.checked) {
            setSelectedMonths([...selectedMonths, month]);
        } else {
            setSelectedMonths(selectedMonths.filter(selectedMonth => selectedMonth !== month));
        }
    };

    const handlePaymentSubmit = () => {
        selectedMonths.forEach(month => {
            const paymentData = {
                userId: selectedInstructor.uid,
                month,
                year: selectedYear,
                total: salaries.find(salary => salary.month === month)?.total || 0,
                isPayment: true
            };
            dispatch(createPayment(paymentData)).then(() => {
                dispatch(fetchPayments(selectedInstructor.uid, selectedYear)); // Refetch payments after creating payment
            });
        });
    };

    const getFormattedData = () => {
        const data = Array.from({ length: 12 }, (_, index) => ({ month: index + 1, total: 0 }));
        salaries.forEach(salary => {
            data[salary.month - 1].total = salary.total;
        });
        return data;
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const getMaxYAxis = (data) => {
        const maxValue = Math.max(...data.map(item => item.total));
        return maxValue + maxValue * 0.1;
    };

    const instructorInfo = selectedInstructor ? getInstructorInfo(selectedInstructor.uid) : { name: '', email: '', level: '' };

    const isMonthPaid = (month) => {
        const payment = payments.find(p => p.month === month);
        return payment ? payment.isPayment : false;
    };



    const handleExportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Salary Data');

        worksheet.columns = [
            { header: 'Tháng', key: 'month', width: 10 },
            { header: 'Lương giảng viên', key: 'total', width: 30 },
            { header: 'Đã thanh toán', key: 'paid', width: 20 },
        ];

        const data = Array.from({ length: 12 }, (_, index) => {
            const month = index + 1;
            const salaryData = salaries.find(salary => salary.month === month) || { total: 0 };
            return {
                month,
                total: salaryData.total,
                paid: isMonthPaid(month) ? 'Yes' : 'No'
            };
        });

        worksheet.addRows(data);

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `SalaryData_${selectedInstructor ? selectedInstructor.name : 'Instructor'}_${selectedYear}.xlsx`);
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
                {selectedInstructor && (
                    <Grid item xs={12}>
                        <Box className={styles.separator}>
                            <Typography variant="body1" className={styles.separatorText}>
                                Thông tin giảng viên
                            </Typography>
                        </Box>
                        <TableContainer component={Paper} className={styles.tableContainer}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableHeader}>UserId</TableCell>
                                        <TableCell className={styles.tableHeader}>Tên giảng viên</TableCell>
                                        <TableCell className={styles.tableHeader}>Email</TableCell>
                                        <TableCell className={styles.tableHeader}>Level</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow className={styles.tableRow}>
                                        <TableCell className={styles.tableCell}>{selectedInstructor.uid}</TableCell>
                                        <TableCell className={styles.tableCell}>{instructorInfo.name}</TableCell>
                                        <TableCell className={styles.tableCell}>{instructorInfo.email}</TableCell>
                                        <TableCell className={styles.tableCell}>{instructorInfo.level}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Box className={styles.separator}>
                        <Typography variant="body1" className={styles.separatorText}>
                            Chi tiết lương giảng viên {instructorInfo.name}
                        </Typography>
                    </Box>
                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table>
                            <TableHead className={styles.tableHeader}>
                                <TableRow>
                                    <TableCell className={styles.tableHeader}>Tháng</TableCell>
                                    <TableCell className={styles.tableHeader}>Lương giảng viên năm {selectedYear}</TableCell>
                                    <TableCell className={styles.tableHeader}>Đã thanh toán</TableCell>
                                    <TableCell className={styles.tableHeader}>Chọn thanh toán</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.from({ length: 12 }, (_, index) => {
                                    const month = index + 1;
                                    const salaryData = salaries.find(salary => salary.month === month) || {};
                                    return (
                                        <TableRow key={month} className={styles.tableRow}>
                                            <TableCell className={styles.tableCell}>{month}</TableCell>
                                            <TableCell className={styles.tableCell}>{salaryData.total ? formatCurrency(salaryData.total) : 'N/A'}</TableCell>
                                            <TableCell className={styles.tableCell}>{isMonthPaid(month) ? <CheckIcon color="primary" /> : 'Chưa'}</TableCell>
                                            <TableCell className={styles.tableCell}>
                                                <Checkbox
                                                    disabled={isMonthPaid(month)}
                                                    onChange={(event) => handleMonthSelect(event, month)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="flex-end" marginTop={2}>
                        <Button className={styles.pay} variant="contained" color="primary" onClick={handlePaymentSubmit}>
                            Thanh toán lương
                        </Button>
                        <Button className={styles.exels} variant="contained" onClick={handleExportToExcel} style={{ marginLeft: '10px' }}>
                            Xuất Excel
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default Admin_InstructorSalary;
