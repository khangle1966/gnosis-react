import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors, calculateSalary, fetchMonthlyData } from '../../redux/action/adminActions';
import styles from './AdminPage.module.scss';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminPage = () => {
    const dispatch = useDispatch();
    const instructors = useSelector((state) => state.admin.instructors);
    const salaries = useSelector((state) => state.admin.salaries);
    const monthlyData = useSelector((state) => state.admin.monthlyData);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    useEffect(() => {
        dispatch(fetchInstructors());
    }, [dispatch]);

    const handleCalculateSalary = (uid) => {
        dispatch(calculateSalary(uid));
    };

    const handleInstructorClick = (uid) => {
        setSelectedInstructor(uid);
        dispatch(fetchMonthlyData(uid));
    };

    const data = instructors.map((instructor) => ({
        name: instructor.name,
        salary: salaries[instructor.uid] || 0,
        students: instructor.totalStudents || 0,
    }));

    const monthlyChartData = selectedInstructor ? monthlyData[selectedInstructor] || [] : [];

    useEffect(() => {
        console.log(monthlyChartData); // Kiểm tra dữ liệu trong frontend
    }, [monthlyChartData]);

    return (
        <div className={styles.adminPage}>
            <h1>Admin Page</h1>
            <h2>Instructors</h2>
            <ul className={styles.instructorList}>
                {instructors.map((instructor) => (
                    <li key={instructor.uid} className={styles.instructorItem} onClick={() => handleInstructorClick(instructor.uid)}>
                        <span className={styles.instructorName}>{instructor.name}</span>
                        <button
                            className={styles.calculateButton}
                            onClick={() => handleCalculateSalary(instructor.uid)}
                        >
                            Calculate Salary
                        </button>
                        {salaries[instructor.uid] && (
                            <span className={styles.instructorSalary}>
                                Salary: {salaries[instructor.uid]}
                            </span>
                        )}
                        <span className={styles.instructorStudents}>
                            Students: {instructor.totalStudents}
                        </span>
                    </li>
                ))}
            </ul>
            <div className={styles.charts}>
                <h2>Instructors Salary Chart</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="salary" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
                <h2>Instructors Students Chart</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="students" fill="#82ca9d" />

                    </BarChart>
                </ResponsiveContainer>
                {selectedInstructor && (
                    <div>
                        <h2>Monthly Data for {selectedInstructor}</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="students" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
