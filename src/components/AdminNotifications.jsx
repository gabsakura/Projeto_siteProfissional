// AdminNotifications.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';

const AdminNotifications = () => {
  const [notificationText, setNotificationText] = useState('');

  // Função para enviar a notificação
  const sendNotification = () => {
    if (notificationText.trim()) {
      const existingNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
      const newNotification = { id: Date.now(), text: notificationText };
      localStorage.setItem('notifications', JSON.stringify([...existingNotifications, newNotification]));
      setNotificationText(''); // Limpa o campo de texto
      alert('Notificação enviada com sucesso!');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Enviar Notificação</Typography>
        <TextField
          label="Nova Notificação"
          value={notificationText}
          onChange={(e) => setNotificationText(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button onClick={sendNotification} variant="contained" color="primary">
          Enviar Notificação
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminNotifications;
