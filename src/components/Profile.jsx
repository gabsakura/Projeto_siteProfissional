// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
  Divider,
  Button,
  TextField,
  Alert,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import api from '../services/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState({
    nome: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    descricao: ''
  });
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        console.log('Token:', token);
        console.log('Usuário salvo:', savedUser);

        if (!savedUser?.id) {
          console.log('ID do usuário não encontrado');
          setError('Usuário não encontrado no localStorage');
          setTimeout(() => {
            localStorage.clear();
            window.location.href = '/login';
          }, 2000);
          return;
        }

        const response = await api.get(`/api/users/${savedUser.id}`);
        console.log('Resposta da API:', response.data);
        
        if (!response.data.user) {
          setError('Usuário não encontrado');
          setTimeout(() => {
            localStorage.clear();
            window.location.href = '/login';
          }, 2000);
          return;
        }

        setUser(response.data.user);
        setEditData({
          nome: response.data.user.nome,
          email: response.data.user.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          descricao: response.data.user.descricao
        });
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        if (error.response?.status === 404) {
          setError('Usuário não encontrado');
          setTimeout(() => {
            localStorage.clear();
            window.location.href = '/login';
          }, 2000);
        } else {
          setError('Erro ao carregar dados do usuário');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({
      ...editData,
      nome: user.nome,
      email: user.email
    });
    setError('');
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('nome', editData.nome);
      formData.append('email', editData.email);
      formData.append('descricao', editData.descricao);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await api.put(`/api/users/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(response.data.user);
      setEditing(false);
      setSuccess('Perfil atualizado com sucesso!');
      
      // Atualiza o usuário no localStorage
      const savedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...savedUser,
        nome: editData.nome,
        email: editData.email,
        avatar: response.data.user.avatar
      }));
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao atualizar perfil');
    }
  };

  const handleChangePassword = async () => {
    if (editData.newPassword !== editData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      await api.put(`/api/users/${user.id}/password`, {
        currentPassword: editData.currentPassword,
        newPassword: editData.newPassword
      });

      setSuccess('Senha atualizada com sucesso!');
      setOpenPasswordDialog(false);
      setEditData({
        ...editData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao atualizar senha');
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        {/* Header com Avatar */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(120deg, #2196f3 0%, #1976d2 100%)',
            color: 'white',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={editing ? avatarPreview || user.avatar : user.avatar}
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto 16px',
                bgcolor: '#1565c0',
                fontSize: '3rem'
              }}
            >
              {user.nome.charAt(0).toUpperCase()}
            </Avatar>
            {editing && (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'white'
                }}
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <PhotoCameraIcon />
              </IconButton>
            )}
          </Box>
          <Typography variant="h4" gutterBottom>
            {user.nome}
          </Typography>
          <Typography variant="subtitle1">
            {user.tipo === 'admin' ? 'Administrador' : 'Usuário'}
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
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

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                {editing ? (
                  <TextField
                    fullWidth
                    label="Nome"
                    value={editData.nome}
                    onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                  />
                ) : (
                  <Typography variant="body1">{user.nome}</Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                {editing ? (
                  <TextField
                    fullWidth
                    label="Email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                ) : (
                  <Typography variant="body1">{user.email}</Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AdminIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="body1">
                  Tipo de Conta: {user.tipo === 'admin' ? 'Administrador' : 'Usuário'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                <PersonIcon sx={{ mr: 2, color: 'primary.main', mt: 1 }} />
                {editing ? (
                  <TextField
                    fullWidth
                    label="Descrição"
                    multiline
                    rows={4}
                    value={editData.descricao || ''}
                    onChange={(e) => setEditData({ ...editData, descricao: e.target.value })}
                    placeholder="Conte um pouco sobre você..."
                  />
                ) : (
                  <Typography variant="body1">
                    {user.descricao || 'Nenhuma descrição fornecida'}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {editing ? (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                    >
                      Salvar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => setOpenPasswordDialog(true)}
                    >
                      Alterar Senha
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                    >
                      Editar Perfil
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Paper>

      {/* Dialog para alteração de senha */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Senha Atual"
              type="password"
              value={editData.currentPassword}
              onChange={(e) => setEditData({ ...editData, currentPassword: e.target.value })}
              fullWidth
            />
            <TextField
              label="Nova Senha"
              type="password"
              value={editData.newPassword}
              onChange={(e) => setEditData({ ...editData, newPassword: e.target.value })}
              fullWidth
            />
            <TextField
              label="Confirmar Nova Senha"
              type="password"
              value={editData.confirmPassword}
              onChange={(e) => setEditData({ ...editData, confirmPassword: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancelar</Button>
          <Button onClick={handleChangePassword} variant="contained">
            Alterar Senha
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;
