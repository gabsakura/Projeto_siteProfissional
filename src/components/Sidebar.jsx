// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Home, Person, Notifications, Dashboard } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = ({ isAdmin }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Painel
        </Typography>
      </Toolbar>
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/profile">
          <ListItemIcon><Person /></ListItemIcon>
          <ListItemText primary="Perfil" />
        </ListItem>
        <ListItem button component={Link} to="/notifications">
          <ListItemIcon><Notifications /></ListItemIcon>
          <ListItemText primary="Notificações" />
        </ListItem>
        {isAdmin && (
          <ListItem button component={Link} to="/admin-notifications">
            <ListItemIcon><Dashboard /></ListItemIcon>
            <ListItemText primary="Notificações Admin" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
