import React from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PaymentIcon from '@mui/icons-material/Payment';
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
                        <ListItemTextStyled primary="Dashboard" />
                    </ListItem>
                </NavLinkStyled>
                <NavLinkStyled to="/admin/instructor-salary">
                    <ListItem button>
                        <ListItemIcon><PeopleIcon style={{ color: '#ffffff' }} /></ListItemIcon>
                        <ListItemTextStyled primary="Instructors" />
                    </ListItem>
                </NavLinkStyled>
                <NavLinkStyled to="/admin/courses">
                    <ListItem button>
                        <ListItemIcon><BookIcon style={{ color: '#ffffff' }} /></ListItemIcon>
                        <ListItemTextStyled primary="Courses" />
                    </ListItem>
                </NavLinkStyled>
                <NavLinkStyled to="/admin/lessons">
                    <ListItem button>
                        <ListItemIcon><MenuBookIcon style={{ color: '#ffffff' }} /></ListItemIcon>
                        <ListItemTextStyled primary="Lessons" />
                    </ListItem>
                </NavLinkStyled>
                <NavLinkStyled to="/admin/payments">
                    <ListItem button>
                        <ListItemIcon><PaymentIcon style={{ color: '#ffffff' }} /></ListItemIcon>
                        <ListItemTextStyled primary="Payments" />
                    </ListItem>
                </NavLinkStyled>
                {/* Add more links as needed */}
            </List>
        </DrawerStyled>
    );
};

export default AdminSidebar;
