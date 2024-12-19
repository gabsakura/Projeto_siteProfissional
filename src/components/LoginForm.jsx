// src/components/LoginForm.js
import React, { useState } from 'react';
import { 
  Avatar, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Box,
  Paper,
  Alert,
  Divider,
  Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123'
  },
  user: {
    email: 'user@example.com',
    password: 'user123'
  }
};

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/api/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        onLogin(response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const handleTestCredentials = (type) => {
    setEmail(TEST_CREDENTIALS[type].email);
    setPassword(TEST_CREDENTIALS[type].password);
    setError('');
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await api.post('/api/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        onLogin(response.data.user);
      }
    } catch (error) {
      console.error('Erro no login:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ 
          m: 1, 
          bgcolor: 'primary.main',
          width: 56,
          height: 56
        }}>
          <LockOutlinedIcon sx={{ fontSize: 32 }} />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ 
              mb: 3,
              py: 1.2,
              fontSize: '1.1rem'
            }}
          >
            Entrar
          </Button>

          <Divider sx={{ mb: 2 }}>
            <Typography color="textSecondary" variant="body2">
              Credenciais de Teste
            </Typography>
          </Divider>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 2,
            justifyContent: 'center'
          }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleTestCredentials('admin')}
              size="small"
            >
              Admin
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleTestCredentials('user')}
              size="small"
            >
              Usuário
            </Button>
          </Box>

          <Box sx={{ 
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography variant="caption" color="textSecondary" align="center">
              Admin: {TEST_CREDENTIALS.admin.email} / {TEST_CREDENTIALS.admin.password}
            </Typography>
            <Typography variant="caption" color="textSecondary" align="center">
              User: {TEST_CREDENTIALS.user.email} / {TEST_CREDENTIALS.user.password}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
