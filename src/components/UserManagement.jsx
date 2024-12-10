import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  Tooltip
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import validateUserData from '../utils/validators';
import { formatDateTime } from '../utils/formatters';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Usuários recebidos:', response.data); // Para debug
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      if (error.response?.status === 403) {
        navigate('/dashboard');
      } else {
        setError('Erro ao carregar usuários');
      }
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nome: user.nome,
        email: user.email,
        password: '',
        confirmarSenha: '',
        tipo: user.tipo,
        verified: user.verified
      });
    } else {
      setEditingUser(null);
      setFormData({
        nome: '',
        email: '',
        password: '',
        confirmarSenha: '',
        tipo: 'user',
        verified: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setError('');
  };

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
    const validationErrors = validateUserData(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    if (!editingUser && formData.password !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (editingUser) {
        // Se estiver editando, só envia a senha se ela foi alterada
        const dataToSend = {
          nome: formData.nome,
          email: formData.email,
          tipo: formData.tipo,
          verified: formData.verified
        };
        if (formData.password) {
          dataToSend.password = formData.password;
        }

        await axios.put(
          `http://localhost:5000/api/users/${editingUser.id}`,
          dataToSend,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.post(
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
      }

      setSuccess(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao processar operação');
      console.error('Erro:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Usuário excluído com sucesso!');
      fetchUsers();
    } catch (error) {
      setError('Erro ao excluir usuário');
      console.error('Erro ao excluir:', error);
    }
  };

  return (
    <Box sx={{ padding: { xs: 2, sm: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      <Card sx={{ mb: 3, borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AdminIcon color="primary" />
              Gerenciamento de Usuários
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Novo Usuário
            </Button>
          </Stack>
        </CardContent>
      </Card>

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

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data de Criaç��o</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      icon={user.tipo === 'admin' ? <AdminIcon /> : <UserIcon />}
                      label={user.tipo === 'admin' ? 'Administrador' : 'Usuário'}
                      color={user.tipo === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.verified ? 'Verificado' : 'Pendente'}
                      color={user.verified ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="textSecondary">
                      {user.created_at ? formatDateTime(user.created_at) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleOpenDialog(user)} color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton 
                        onClick={() => handleDeleteUser(user.id)} 
                        color="error" 
                        size="small"
                        disabled={user.tipo === 'admin'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="textSecondary">
                    Nenhum usuário encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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

            {!editingUser && (
              <>
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
              </>
            )}

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

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="verified"
                value={formData.verified}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value={true}>Verificado</MenuItem>
                <MenuItem value={false}>Pendente</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 