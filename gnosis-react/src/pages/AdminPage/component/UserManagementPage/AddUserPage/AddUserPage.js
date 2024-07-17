import React, { useState } from 'react'; // Import React và hook useState
import { useDispatch, useSelector } from 'react-redux'; // Import các hook từ react-redux để kết nối với Redux store
import { createUser } from '../../../../../redux/action/userActions'; // Import hành động createUser từ userActions
import { TextField, Button, MenuItem, Typography, Box, Paper } from '@mui/material'; // Import các component từ MUI
import styles from './AddUserPage.module.scss'; // Import các lớp CSS module

const AddUserPage = () => {
    const dispatch = useDispatch(); // Khởi tạo hook useDispatch để dispatch các hành động
    const { loading, error } = useSelector(state => state.user); // Sử dụng hook useSelector để lấy trạng thái từ Redux store

    const [userData, setUserData] = useState({
        email: '',
        password: '',
        role: 'user',
    }); // Khai báo state userData để lưu trữ thông tin người dùng mới

    // Hàm xử lý thay đổi dữ liệu đầu vào
    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    // Hàm xử lý gửi form
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createUser(userData)); // Dispatch hành động createUser với dữ liệu người dùng
    };

    return (
        <Box className={styles.addUserPage}>
            <Typography variant="h4" gutterBottom className={styles.header}>
                Thêm người dùng mới
            </Typography>
            <Paper className={styles.formContainer}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        name="email"
                        variant="outlined"
                        value={userData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mật khẩu"
                        name="password"
                        type="password"
                        variant="outlined"
                        value={userData.password}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Quyền"
                        name="role"
                        variant="outlined"
                        value={userData.role}
                        onChange={handleChange}
                        select
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="instructors">Instructor</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? 'Đang thêm...' : 'Thêm người dùng'}
                    </Button>
                    {error && <Typography color="error">{error}</Typography>}
                </form>
            </Paper>
        </Box>
    );
};

export default AddUserPage;
