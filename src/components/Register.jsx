// src/components/Register.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmarSenha: '',
    tipo: 'user',
    verified: true
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/verify-admin', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data.isAdmin) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        navigate('/');
      }
    };

    verificarAdmin();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (!formData.nome || !formData.email || !formData.password || !formData.confirmarSenha) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (formData.password !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/users/register',
        {
          nome: formData.nome,
          email: formData.email,
          password: formData.password,
          tipo: formData.tipo,
          verified: formData.verified
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Usuário criado com sucesso!');
      setFormData({
        nome: '',
        email: '',
        password: '',
        confirmarSenha: '',
        tipo: 'user',
        verified: true
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao criar usuário');
      console.error('Erro ao registrar:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', pt: 4 }}>
      <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <PersonAddIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" component="h1">
              Criar Novo Usuário
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Nome completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Senha"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                helperText="Mínimo de 6 caracteres"
              />

              <TextField
                label="Confirmar Senha"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleChange}
                fullWidth
                required
              />

              <FormControl fullWidth>
                <InputLabel>Tipo de Usuário</InputLabel>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  label="Tipo de Usuário"
                >
                  <MenuItem value="user">Usuário</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Criar Usuário
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
