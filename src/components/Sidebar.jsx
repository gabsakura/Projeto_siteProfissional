// Sidebar.jsx
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, to: '/dashboard' },
  { label: 'Notifications', icon: <NotificationsIcon />, to: '/notifications' },
  { label: 'Profile', icon: <PersonIcon />, to: '/profile' },
];

const Sidebar = () => {
  return (
    <div className="sidebar">
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={index} component="a" href={item.to}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
