// Sidebar.jsx
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useLocation, Link } from 'react-router-dom';

const Sidebar = ({ isAdmin }) => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, to: '/dashboard' },
    { label: 'Notifications', icon: <NotificationsIcon />, to: '/notifications' },
    { label: 'Profile', icon: <PersonIcon />, to: '/profile' },
  ];

  // Condicionalmente adiciona a rota de Admin Notifications se isAdmin for verdadeiro
  if (isAdmin) {
    menuItems.push({ label: 'Admin Notifications', icon: <AdminPanelSettingsIcon />, to: '/admin-notifications' });
  }

  return (
    <div className="sidebar">
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={index} component={Link} to={item.to} selected={location.pathname === item.to}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
