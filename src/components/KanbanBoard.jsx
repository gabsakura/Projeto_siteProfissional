// KanbanBoard.js
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';

const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Busca as colunas do quadro 1 (quadro padrão)
      const columnsResponse = await api.get('/api/boards/1/columns');
      setColumns(columnsResponse.data.columns);

      // Busca os cartões para cada coluna
      const tasksData = {};
      for (const column of columnsResponse.data.columns) {
        const cardsResponse = await api.get(`/api/columns/${column.id}/cards`);
        tasksData[column.id] = cardsResponse.data.cards;
      }
      setTasks(tasksData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar o quadro Kanban');
    } finally {
      setLoading(false);
    }
  };

  const moveTask = async (taskId, fromColumnId, toColumnId) => {
    try {
      // Atualiza localmente primeiro
      const updatedTasks = { ...tasks };
      const task = updatedTasks[fromColumnId].find(t => t.id === taskId);
      updatedTasks[fromColumnId] = updatedTasks[fromColumnId].filter(t => t.id !== taskId);
      updatedTasks[toColumnId] = [...(updatedTasks[toColumnId] || []), task];
      setTasks(updatedTasks);

      // Atualiza no backend
      await api.put(`/api/cards/${taskId}/move`, {
        columnId: toColumnId,
        position: updatedTasks[toColumnId].length - 1
      });
    } catch (error) {
      console.error('Erro ao mover cartão:', error);
      // Reverte em caso de erro
      fetchData();
    }
  };

  const addTask = async (columnId) => {
    const title = prompt('Digite o título da tarefa:');
    if (!title) return;

    try {
      const response = await api.post(`/api/columns/${columnId}/cards`, {
        title,
        description: '',
        column_id: columnId
      });

      setTasks(prev => ({
        ...prev,
        [columnId]: [...(prev[columnId] || []), response.data]
      }));
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {columns.map((column) => (
          <Grid item xs={12} sm={6} md={4} key={column.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2 
                }}>
                  <Typography variant="h6">{column.title}</Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => addTask(column.id)}
                  >
                    + Adicionar
                  </Button>
                </Box>
                <Box sx={{ minHeight: 200 }}>
                  {tasks[column.id]?.map((task) => (
                    <Card 
                      key={task.id} 
                      sx={{ 
                        mb: 1, 
                        p: 1,
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <Typography>{task.title}</Typography>
                      {column.id !== columns[columns.length - 1].id && (
                        <Button 
                          size="small"
                          onClick={() => moveTask(
                            task.id, 
                            column.id, 
                            columns[columns.indexOf(column) + 1].id
                          )}
                        >
                          Mover →
                        </Button>
                      )}
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KanbanBoard;
