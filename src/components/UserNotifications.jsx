// UserNotifications.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

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
    <Card>
      <CardContent>
        <Typography variant="h5">Notificações</Typography>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id}>
              <Typography>{notification.text}</Typography>
              <Button onClick={() => markAsRead(notification.id)}>Marcar como Lida</Button>
            </div>
          ))
        ) : (
          <Typography>Nenhuma notificação</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UserNotifications;
