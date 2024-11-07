// Notifications.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const initialNotifications = [
  { id: 1, text: 'Notification 1' },
  { id: 2, text: 'Notification 2' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Notifications</Typography>
        {notifications.map((notification) => (
          <div key={notification.id}>
            <Typography>{notification.text}</Typography>
            <Button onClick={() => markAsRead(notification.id)}>Mark as Read</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Notifications;
