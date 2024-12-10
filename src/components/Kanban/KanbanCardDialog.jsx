import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

const KanbanCardDialog = ({ open, onClose, card, onSave }) => {
  const [formData, setFormData] = useState(card || {
    title: '',
    description: '',
    priority: 'medium',
    start_date: new Date(),
    due_date: null,
    assigned_to: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {card ? 'Editar Tarefa' : 'Nova Tarefa'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Título da Tarefa"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Prioridade</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Prioridade"
            >
              <MenuItem value="low">Baixa</MenuItem>
              <MenuItem value="medium">Média</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label="Data de Início"
              value={formData.start_date}
              onChange={(newValue) => {
                setFormData(prev => ({
                  ...prev,
                  start_date: newValue
                }));
              }}
              slotProps={{ textField: { fullWidth: true } }}
            />

            <DatePicker
              label="Data de Término"
              value={formData.due_date}
              onChange={(newValue) => {
                setFormData(prev => ({
                  ...prev,
                  due_date: newValue
                }));
              }}
              slotProps={{ textField: { fullWidth: true } }}
              minDate={formData.start_date}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!formData.title}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KanbanCardDialog; 