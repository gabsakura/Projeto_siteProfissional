// src/components/Main.js
import React from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

function Main() {
  // Simulação de dados do usuário logado
  const user = {
    name: 'João Silva',
    email: 'joao.silva@example.com',
    role: 'Administrador'
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center', width: '80%', maxWidth: 500 }}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo, {user.name}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Email: {user.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Função: {user.role}
        </Typography>
      </Paper>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button component={Link} to="/dashboard" variant="contained">Dashboard</Button>
        <Button component={Link} to="/profile" variant="contained">Perfil</Button>
        <Button component={Link} to="/notifications" variant="contained">Notificações</Button>
        <Button component={Link} to="/kanban" variant="contained">Kanban</Button>
      </Box>
    </Box>
  );
}

export default Main;
