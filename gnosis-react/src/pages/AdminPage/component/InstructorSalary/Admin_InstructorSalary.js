import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors, calculateSalary, fetchMonthlyData, fetchInstructorSalaries, paySalaries } from '../../../../redux/action/adminActions';
import { Box, Button, Typography, Card, CardContent, CardActions, TextField, Autocomplete } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import styles from './Admin_InstructorSalary.module.scss';

const Admin_InstructorSalary = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchInstructors());
    }, [dispatch]);







    return (
        <div>instructor slary</div>
    );
};

export default Admin_InstructorSalary;
