import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors, calculateSalary, fetchMonthlyData } from '../../../../redux/action/adminActions';
import { Box, Button, Typography, Card, CardContent, CardActions, TextField, Autocomplete } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import styles from './Admin_InstructorSalary.module.scss';

const Admin_InstructorSalary = () => {
    const dispatch = useDispatch();
    const instructors = useSelector((state) => state.admin.instructors);
    const salaries = useSelector((state) => state.admin.salaries);
    const monthlyData = useSelector((state) => state.admin.monthlyData);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [selectedInstructorId, setSelectedInstructorId] = useState(null);

    useEffect(() => {
        dispatch(fetchInstructors());
    }, [dispatch]);

    const handleCalculateSalary = (uid) => {
        dispatch(calculateSalary(uid));
    };

    const handleInstructorClick = (uid) => {
        setSelectedInstructorId(uid);
        dispatch(fetchMonthlyData(uid));
    };

    const data = instructors.map((instructor) => ({
        name: instructor.name,
        salary: salaries[instructor.uid] || 0,
        students: instructor.totalStudents || 0,
        level: instructor.instructorLevel || 'Unknown', // Thêm trường level
    }));

    const monthlyChartData = selectedInstructorId ? monthlyData[selectedInstructorId] || [] : [];

    return (
        <Box className={styles.adminPage}>
            <Box className={styles.contentWrapper}>
                <Typography variant="h4" gutterBottom>
                    Admin Page
                </Typography>
                <Autocomplete
                    options={instructors}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            setSelectedInstructor(newValue);
                            handleInstructorClick(newValue.uid);
                        } else {
                            setSelectedInstructor(null);
                            setSelectedInstructorId(null);
                        }
                    }}
                    renderInput={(params) => <TextField {...params} label="Select Instructor" variant="outlined" />}
                    className={styles.autocomplete}
                />
                {selectedInstructor && (
                    <Card className={styles.instructorItem}>
                        <CardContent>
                            <Typography className={styles.instructorName}>
                                {selectedInstructor.name} - {selectedInstructor.instructorLevel}
                            </Typography>

                            {salaries[selectedInstructor.uid] && (
                                <Typography className={styles.instructorSalary}>
                                    Salary: {salaries[selectedInstructor.uid]}
                                </Typography>
                            )}
                            <Typography className={styles.instructorStudents}>
                                Students: {selectedInstructor.totalStudents}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleCalculateSalary(selectedInstructor.uid)}
                            >
                                Calculate Salary
                            </Button>
                        </CardActions>
                    </Card>
                )}
                <Box className={styles.charts}>
                    <Card className={styles.chartCard}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Instructors Salary Chart
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }} />
                                    <Bar dataKey="salary" fill="#8884d8">
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.salary > 0 ? '#8884d8' : '#ff8042'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className={styles.chartCard}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Instructors Students Chart
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }} />
                                    <Bar dataKey="students" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    {selectedInstructorId && (
                        <Card className={styles.chartCard}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Monthly Data for {selectedInstructor.name}
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }} />
                                        <Line type="monotone" dataKey="students" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Admin_InstructorSalary;
