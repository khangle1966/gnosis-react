import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Toolbar, Typography, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const DrawerStyled = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#1e1e2d',
        color: '#ffffff',
    },
}));

const NavLinkStyled = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    color: 'inherit',
    '&.active': {
        backgroundColor: '#33334d',
    },
    '&:hover': {
        backgroundColor: '#44445d',
        transition: 'background-color 0.3s',
    },
}));

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
    '& .MuiTypography-root': {
        color: '#ffffff',
    },
}));

const AdminSidebar = () => {
    const [openUser, setOpenUser] = useState(false);
    const [openInstructor, setOpenInstructor] = useState(false);

    const handleClickOpenUser = () => {
        setOpenUser(!openUser);
    };
    const handleClickOpenInstructor = () => {
        setOpenInstructor(!openInstructor);
    };

    return (
        <DrawerStyled
            variant="permanent"
        >
            <Toolbar>
                <Typography variant="h6" noWrap>
                    GNOSIS Admin
                </Typography>
            </Toolbar>
            <List>
                <NavLinkStyled to="/admin/dashboard">
                    <ListItem button>
                        <ListItemIcon><DashboardIcon style={{ color: '#ffffff' }} /></ListItemIcon>
                        <ListItemTextStyled primary="Trang chủ" />
                    </ListItem>
                </NavLinkStyled>
                <ListItem button onClick={handleClickOpenUser}>
                    <ListItemIcon><PersonIcon style={{ color: '#ffffff' }} /></ListItemIcon>
                    <ListItemTextStyled primary="Quản lý người dùng" />
                    {openUser ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openUser} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <NavLinkStyled to="/admin/user-list">
                            <ListItem button style={{ paddingLeft: 32 }}>
                                <ListItemTextStyled primary="Danh sách người dùng" />
                            </ListItem>
                        </NavLinkStyled>
                        <NavLinkStyled to="/admin/add-user">
                            <ListItem button style={{ paddingLeft: 32 }}>
                                <ListItemTextStyled primary="Thêm người dùng" />
                            </ListItem>
                        </NavLinkStyled>
                    </List>
                </Collapse>
                <ListItem button onClick={handleClickOpenInstructor}>
                    <ListItemIcon><PeopleIcon style={{ color: '#ffffff' }} /></ListItemIcon>
                    <ListItemTextStyled primary="Giảng viên" />
                    {openInstructor ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openInstructor} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <NavLinkStyled to="/admin/instructor-salary">
                            <ListItem button style={{ paddingLeft: 32 }}>
                                <ListItemTextStyled primary="Salary" />
                            </ListItem>
                        </NavLinkStyled>

                    </List>
                </Collapse>





            </List>
        </DrawerStyled>
    );
};

export default AdminSidebar;
