// src/components/Profile.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import '../styles/profile.css';
function Profile() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">User Profile</Typography>
        <Typography variant="body1">Name: John Doe</Typography>
        <Typography variant="body1">Email: john.doe@example.com</Typography>
        <Typography variant="body1">Role: Admin</Typography>
        {/* Adicione mais detalhes do perfil conforme necessário */}
      </CardContent>
    </Card>
  );
}

export default Profile;
