import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, banUser, unbanUser } from '../../../../redux/action/userActions';
import { fetchUserGoogle, banUserGoogle, unbanUserGoogle, updateUserGoogle } from '../../../../redux/action/userGoogleActions';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Typography, Tabs, Tab, Box, TablePagination, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/GetApp';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import styles from './UserManagementPage.module.scss';

const UserManagementPage = () => {
    const dispatch = useDispatch();
    const { users, loading: loadingUsers, error: errorUsers } = useSelector(state => state.user);
    const { userGoogle, loading: loadingUserGoogle, error: errorUserGoogle } = useSelector(state => state.userGoogle);
    const [searchTerm, setSearchTerm] = useState('');
    const [tabIndex, setTabIndex] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchUserGoogle());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBan = (id, type) => {
        if (type === 'user') {
            dispatch(banUser(id));
        } else {
            dispatch(banUserGoogle(id));
        }
    };

    const handleUnban = (id, type) => {
        if (type === 'user') {
            dispatch(unbanUser(id));
        } else {
            dispatch(unbanUserGoogle(id));
        }
    };

    const handleUpdate = (id, updateUserDto, type) => {
        if (type === 'user') {
            dispatch(updateUser(id, updateUserDto));
        } else {
            dispatch(updateUserGoogle(id, updateUserDto));
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        setPage(0); // Reset page when changing tabs
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    const filterUsers = (users) => {
        return users.filter(user => {
            const email = user.email || '';
            const name = user.name || '';
            return email.toLowerCase().includes(searchTerm.toLowerCase()) || name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    const filteredUsers = filterUsers(users);
    const filteredUserGoogle = filterUsers(userGoogle);

    const handleExportExcel = async () => {
        const userList = tabIndex === 0 ? filteredUsers : filteredUserGoogle;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');

        worksheet.columns = [
            { header: 'STT', key: 'stt', width: 10 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Họ và tên', key: 'name', width: 30 },
            { header: 'Số điện thoại', key: 'phone', width: 20 },
            { header: 'Ngày sinh', key: 'dateOfBirth', width: 15 },
            { header: 'Giới tính', key: 'gender', width: 10 },
            { header: 'Quyền', key: 'role', width: 10 }
        ];

        userList.forEach((user, index) => {
            worksheet.addRow({
                stt: index + 1,
                email: user.email,
                name: user.name,
                phone: user.phone || 'N/A',
                dateOfBirth: new Date(user.dateOfBirth).toLocaleDateString(),
                gender: user.gender,
                role: user.role
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'users.xlsx');
    };

    const renderUserTable = (userList, type) => (
        <>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Ngày sinh</TableCell>
                            <TableCell>Giới tính</TableCell>
                            <TableCell>Quyền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                            <TableRow key={user.uid} className={styles.tableRow}>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.phone || 'N/A'}</TableCell>
                                <TableCell>{new Date(user.dateOfBirth).toLocaleDateString()}</TableCell>
                                <TableCell>{user.gender}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.isBanned ? 'Bị cấm' : 'Hoạt động'}</TableCell>
                                <TableCell>
                                    {user.isBanned ? (
                                        <Button color="secondary" onClick={() => handleUnban(user.uid, type)} className={styles.button}>Unban</Button>
                                    ) : (
                                        <Button color="secondary" onClick={() => handleBan(user.uid, type)} className={styles.button}>Ban</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20]}
                component="div"
                count={userList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className={styles.tablePagination}
            />
        </>
    );

    return (
        <div className={styles.userManagementPage}>
            <Typography variant="h4" gutterBottom className={styles.header}>
                Quản lý người dùng
            </Typography>
            <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary" className={styles.tabs}>
                <Tab label="User" />
                <Tab label="User Google" />
            </Tabs>
            <Box display="flex" alignItems="center" justifyContent="space-between" className={styles.searchAndExport}>
                <TextField
                    label="Tìm kiếm theo email hoặc tên"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchField}
                    InputProps={{
                        endAdornment: (
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                />
                <Button variant="contained" color="primary" startIcon={<DownloadIcon />} className={styles.exportButton} onClick={handleExportExcel}>
                    Xuất excel
                </Button>
            </Box>
            <Box hidden={tabIndex !== 0}>
                {renderUserTable(filteredUsers, 'user')}
            </Box>
            <Box hidden={tabIndex !== 1}>
                {renderUserTable(filteredUserGoogle, 'usergoogle')}
            </Box>
            {(loadingUsers || loadingUserGoogle) && <p>Loading...</p>}
            {(errorUsers || errorUserGoogle) && <p>{errorUsers || errorUserGoogle}</p>}
        </div>
    );
};

export default UserManagementPage;
