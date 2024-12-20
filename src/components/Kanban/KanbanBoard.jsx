import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import KanbanColumn from './KanbanColumn';
import KanbanCardDialog from './KanbanCardDialog';
import { kanbanAPI } from '../../services/api';
import '../../styles/kanban.css';

const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchColumns = async () => {
      console.log('Buscando colunas do Kanban...');
      try {
        setLoading(true);
        const response = await kanbanAPI.getColumns();
        console.log('Resposta das colunas:', response);
        setColumns(response?.data?.columns || []);
      } catch (error) {
        console.log('Erro detalhado do Kanban:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar o quadro Kanban');
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, []);

  const handleAddColumn = async () => {
    const title = prompt('Nome da coluna:');
    if (!title) return;

    try {
      const response = await kanbanAPI.post('/api/kanban/boards/1/columns', {
        title,
        order_index: columns.length
      });
      setColumns([...columns, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar coluna:', error);
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setOpenDialog(true);
  };

  const handleSaveCard = async (cardData) => {
    try {
      if (cardData.id) {
        const response = await kanbanAPI.put(`/api/kanban/cards/${cardData.id}`, cardData);
        // Atualiza o cartão na lista
        const newCards = { ...cards };
        const columnCards = newCards[cardData.column_id];
        const index = columnCards.findIndex(c => c.id === cardData.id);
        columnCards[index] = response.data;
        setCards(newCards);
      } else {
        // Formata as datas para ISO string
        const formattedData = {
          ...cardData,
          start_date: cardData.start_date ? cardData.start_date.toISOString() : null,
          due_date: cardData.due_date ? cardData.due_date.toISOString() : null
        };

        const response = await kanbanAPI.post(`/api/kanban/columns/${columns[0].id}/cards`, formattedData);

        const newCards = { ...cards };
        if (!newCards[columns[0].id]) {
          newCards[columns[0].id] = [];
        }
        newCards[columns[0].id].push(response.data);
        setCards(newCards);
      }
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      if (error.response) {
        console.error('Detalhes do erro:', error.response.data);
      }
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns.find(col => col.id.toString() === source.droppableId);
    const destColumn = columns.find(col => col.id.toString() === destination.droppableId);
    const card = cards[sourceColumn.id].find(c => c.id.toString() === draggableId);

    // Atualiza o estado localmente
    const newCards = { ...cards };
    
    // Remove do source
    newCards[sourceColumn.id] = cards[sourceColumn.id].filter(
      c => c.id.toString() !== draggableId
    );

    // Adiciona no destination
    const destCards = Array.from(cards[destColumn.id] || []);
    destCards.splice(destination.index, 0, card);
    newCards[destColumn.id] = destCards;

    setCards(newCards);

    // Atualiza no backend
    try {
      await kanbanAPI.put(`/api/kanban/cards/${card.id}/move`, {
        columnId: destColumn.id,
        position: destination.index
      });
    } catch (error) {
      console.error('Erro ao mover cartão:', error);
      // Reverte as mudanças em caso de erro
      setCards(cards);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Tem certeza que deseja excluir este cartão?')) return;

    try {
      await kanbanAPI.delete(`/api/kanban/cards/${cardId}`);
      
      // Atualiza o estado removendo o cartão
      const newCards = { ...cards };
      Object.keys(newCards).forEach(columnId => {
        newCards[columnId] = newCards[columnId].filter(card => card.id !== cardId);
      });
      setCards(newCards);
    } catch (error) {
      console.error('Erro ao excluir cartão:', error);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta coluna e todos os seus cartões?')) return;

    try {
      await kanbanAPI.delete(`/api/kanban/columns/${columnId}`);
      
      // Atualiza o estado removendo a coluna e seus cartões
      setColumns(columns.filter(col => col.id !== columnId));
      const newCards = { ...cards };
      delete newCards[columnId];
      setCards(newCards);
    } catch (error) {
      console.error('Erro ao excluir coluna:', error);
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

  if (!columns || columns.length === 0) {
    return <div>Nenhuma coluna encontrada</div>;
  }

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <Typography variant="h5">Quadro Kanban</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedCard(null);
            setOpenDialog(true);
          }}
        >
          Nova Tarefa
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id.toString()}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="kanban-column"
                >
                  <KanbanColumn
                    column={column}
                    cards={cards[column.id] || []}
                    provided={provided}
                    onCardClick={handleCardClick}
                    onDeleteCard={handleDeleteCard}
                    onDeleteColumn={handleDeleteColumn}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <Button 
            variant="outlined"
            onClick={handleAddColumn}
            className="add-column-button"
          >
            Adicionar Coluna
          </Button>
        </div>
      </DragDropContext>

      <KanbanCardDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        card={selectedCard}
        onSave={handleSaveCard}
      />
    </div>
  );
};

export default KanbanBoard; 