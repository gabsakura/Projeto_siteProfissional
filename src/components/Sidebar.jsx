// src/components/Sidebar.js
import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  IconButton,
  Divider,
  Box
} from '@mui/material';
import { 
  Home, 
  Person, 
  Notifications, 
  Dashboard, 
  AdminPanelSettings,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isAdmin, darkMode, toggleDarkMode, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpa o localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Executa a função de logout do App
    if (onLogout) {
      onLogout();
    }
    
    // Redireciona para a página de login
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
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
      <Divider />
      
      {/* Menu principal */}
      <List sx={{ flexGrow: 1 }}>
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
      
      {/* Botão de Logout */}
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItem 
          button 
          onClick={handleLogout}
          sx={{ 
            borderRadius: '8px',
            '&:hover': { 
              backgroundColor: 'error.light',
              '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: 'error.main'
              }
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText 
            primary="Sair" 
            primaryTypographyProps={{ 
              color: 'error',
              fontWeight: 'medium'
            }} 
          />
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
