// Inventory.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
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
  Typography,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import api from '../services/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    item: '',
    quantity: 1,
    descricao: '',
    preco: 0
  });

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory');
      setInventory(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar o inventário:', error);
      setError('Erro ao carregar inventário');
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        item: item.item,
        quantity: item.quantity,
        descricao: item.descricao,
        preco: item.preco
      });
    } else {
      setEditingItem(null);
      setFormData({
        item: '',
        quantity: 1,
        descricao: '',
        preco: 0
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.item) {
        setError('Nome do item é obrigatório');
        return;
      }

      if (editingItem) {
        await api.put(`/inventory/${editingItem.id}`, formData);
        setSuccess('Item atualizado com sucesso!');
      } else {
        await api.post('/inventory', formData);
        setSuccess('Item adicionado com sucesso!');
      }
      
      setOpenDialog(false);
      fetchInventory();
      setFormData({
        item: '',
        quantity: 1,
        descricao: '',
        preco: 0
      });
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      setError('Erro ao salvar item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) {
      return;
    }

    try {
      await api.delete(`/inventory/${id}`);
      setSuccess('Item excluído com sucesso!');
      fetchInventory();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      setError('Erro ao excluir item');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'preco' ? Number(value) : value
    }));
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    }}>
      <Paper sx={{ 
        p: 3,
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Inventário
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              px: 3
            }}
          >
            Adicionar Item
          </Button>
        </Box>

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

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Item</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Quantidade</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Descrição</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Preço</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow 
                  key={item.id}
                  sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                >
                  <TableCell sx={{ fontSize: '0.95rem' }}>{item.item}</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.95rem' }}>{item.quantity}</TableCell>
                  <TableCell sx={{ fontSize: '0.95rem' }}>{item.descricao}</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.95rem' }}>
                    R$ {Number(item.preco).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(item)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Editar Item' : 'Adicionar Item ao Inventário'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome do Item"
              name="item"
              value={formData.item}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Quantidade"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              fullWidth
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Preço"
              name="preco"
              type="number"
              value={formData.preco}
              onChange={handleChange}
              fullWidth
              InputProps={{ 
                inputProps: { min: 0, step: 0.01 },
                startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
          >
            {editingItem ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
