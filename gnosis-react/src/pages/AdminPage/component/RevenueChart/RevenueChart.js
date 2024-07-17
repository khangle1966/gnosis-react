import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthlyRevenueData } from '../../../../redux/action/adminActions';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, linearGradient } from 'recharts';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import styles from '../../AdminPage.module.scss'; // Import file SCSS

const RevenueChart = () => {
    const dispatch = useDispatch();
    const monthlyRevenue = useSelector(state => state.admin.monthlyRevenue); // Lấy dữ liệu doanh thu hàng tháng từ Redux store
    const [year, setYear] = useState(new Date().getFullYear()); // Trạng thái cho năm được chọn
    const [years, setYears] = useState([]); // Trạng thái cho danh sách các năm

    useEffect(() => {
        // Dispatch hành động để lấy dữ liệu doanh thu hàng tháng khi năm thay đổi
        dispatch(fetchMonthlyRevenueData(year));
    }, [dispatch, year]);

    useEffect(() => {
        // Thiết lập danh sách các năm có thể chọn trong selector
        const currentYear = new Date().getFullYear();
        const availableYears = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);
        setYears(availableYears);
    }, []);

    // Hàm xử lý khi năm được chọn thay đổi
    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    // Chuẩn bị dữ liệu cho biểu đồ với đầy đủ các tháng, kể cả khi một số tháng không có doanh thu
    const getFullMonthlyData = (data) => {
        const fullData = Array.from({ length: 12 }, (_, i) => ({ _id: i + 1, totalRevenue: 0 }));
        data.forEach(item => {
            fullData[item._id - 1].totalRevenue = item.totalRevenue;
        });
        return fullData;
    };

    // Định dạng tiền tệ sang VND
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <Box className={styles.revenueChartContainer}>
            {/* Selector cho năm */}
            <Select
                value={year}
                onChange={handleYearChange}
                displayEmpty
                className={styles.selectYear}
                inputProps={{ 'aria-label': 'Chọn năm' }}
            >
                {years.map((yearOption) => (
                    <MenuItem key={yearOption} value={yearOption}>
                        {yearOption}
                    </MenuItem>
                ))}
            </Select>
            <Typography variant="h6" className={styles.chartTitle}>Biểu đồ doanh thu theo từng tháng trong năm</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getFullMonthlyData(monthlyRevenue)}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" label={{ value: 'Tháng', position: 'insideBottomRight', offset: 0 }} />
                    <YAxis
                        label={{ value: 'Doanh thu', angle: -90, position: 'insideLeft' }}
                        tickFormatter={formatCurrency}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend verticalAlign="top" height={36} />
                    <Area type="monotone" dataKey="totalRevenue" stroke="#4caf50" fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu" />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default RevenueChart;
