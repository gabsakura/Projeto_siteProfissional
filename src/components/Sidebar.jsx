// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, IconButton } from '@mui/material';
import { Home, Person, Notifications, Dashboard, AdminPanelSettings } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = ({ isAdmin, darkMode, toggleDarkMode }) => {
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
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" noWrap component="div">
          Painel
        </Typography>
        <IconButton onClick={toggleDarkMode} sx={{ fontSize: '1.5rem' }}>
          {darkMode ? '🌞' : '🌜'}
        </IconButton>
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
          <>
            <ListItem button component={Link} to="/admin-notifications">
              <ListItemIcon><Dashboard /></ListItemIcon>
              <ListItemText primary="Notificações Admin" />
            </ListItem>
            <ListItem button component={Link} to="/admin/users">
              <ListItemIcon><AdminPanelSettings /></ListItemIcon>
              <ListItemText primary="Gerenciar Usuários" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
