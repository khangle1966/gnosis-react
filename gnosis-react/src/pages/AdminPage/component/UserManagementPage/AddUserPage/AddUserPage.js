import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../../../../../redux/action/userActions';
import { TextField, Button, MenuItem, Typography, Box, Paper } from '@mui/material';
import styles from './AddUserPage.module.scss';

const AddUserPage = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.user);

    const [userData, setUserData] = useState({
        email: '',
        password: '',
        role: 'user',
    });

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createUser(userData));
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
