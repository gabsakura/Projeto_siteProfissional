// AdminNotifications.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
  Snackbar,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Send as SendIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const AdminNotifications = () => {
  const [notificationText, setNotificationText] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem('notifications')) || []
  );

  const sendNotification = () => {
    if (notificationText.trim()) {
      const newNotification = {
        id: Date.now(),
        text: notificationText,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      const updatedNotifications = [...notifications, newNotification];
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
      setNotificationText('');
      setOpenSnackbar(true);
    }
  };

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
      <Paper elevation={0} sx={{ 
        borderRadius: '12px',
        overflow: 'hidden',
        mb: 3,
        background: 'linear-gradient(120deg, #2196f3 0%, #1976d2 100%)'
      }}>
        <Box sx={{ p: 3, color: 'white', textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4" gutterBottom>
            Central de Notificações
          </Typography>
          <Typography variant="subtitle1">
            Envie notificações para todos os usuários
          </Typography>
        </Box>
      </Paper>

      <Card sx={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Nova Notificação"
              value={notificationText}
              onChange={(e) => setNotificationText(e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Digite sua mensagem aqui..."
              sx={{ mb: 2 }}
            />
            <Button
              onClick={sendNotification}
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              disabled={!notificationText.trim()}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                px: 4
              }}
            >
              Enviar Notificação
            </Button>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
            Notificações Enviadas
          </Typography>
          
          {notifications.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {notifications.map((notification) => (
                <Paper
                  key={notification.id}
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {notification.text}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Enviado em: {new Date(notification.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Tooltip title="Excluir notificação">
                    <IconButton
                      onClick={() => deleteNotification(notification.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography color="textSecondary" align="center">
              Nenhuma notificação enviada
            </Typography>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Notificação enviada com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminNotifications;
