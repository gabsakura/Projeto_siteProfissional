// UserNotifications.jsx
import React, { useEffect, useState } from 'react';
import { 
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  IconButton,
  Badge,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(savedNotifications);
  }, []);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.filter((n) => n.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
      <Paper elevation={0} sx={{ 
        borderRadius: '12px',
        overflow: 'hidden',
        mb: 3,
        background: theme => theme.palette.mode === 'dark' 
          ? 'linear-gradient(120deg, #1976d2 0%, #115293 100%)'
          : 'linear-gradient(120deg, #ff9800 0%, #f57c00 100%)'
      }}>
        <Box sx={{ p: 3, color: 'white', textAlign: 'center' }}>
          <Badge badgeContent={notifications.length} color="error" sx={{ mb: 1 }}>
            <NotificationsIcon sx={{ fontSize: 40 }} />
          </Badge>
          <Typography variant="h4" gutterBottom>
            Suas Notificações
          </Typography>
          <Typography variant="subtitle1">
            {notifications.length} {notifications.length === 1 ? 'notificação' : 'notificações'} não {notifications.length === 1 ? 'lida' : 'lidas'}
          </Typography>
        </Box>
      </Paper>

      <Card sx={{ 
        borderRadius: '12px',
        boxShadow: theme => theme.palette.mode === 'dark' 
          ? '0 2px 8px rgba(255,255,255,0.1)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        bgcolor: 'background.paper'
      }}>
        <CardContent>
          {notifications.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {notifications.map((notification) => (
                <Paper
                  key={notification.id} 
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    border: theme => `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme => notification.read 
                      ? theme.palette.action.hover
                      : theme.palette.background.paper,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1
                  }}>
                    <Typography variant="body1" sx={{ flex: 1 }}>
                      {notification.text}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Marcar como lida">
                        <IconButton
                          onClick={() => markAsRead(notification.id)}
                          color="primary"
                          size="small"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    Recebido em: {new Date(notification.timestamp).toLocaleString()}
                  </Typography>
                </Paper>
              ))}
            </Box>
          ) : (
            <Box sx={{ 
              textAlign: 'center',
              py: 4
            }}>
              <NotificationsIcon sx={{ 
                fontSize: 60, 
                color: 'text.disabled', 
                mb: 2 
              }} />
              <Typography variant="h6" color="textSecondary">
                Nenhuma notificação
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Você não tem notificações não lidas
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserNotifications;
