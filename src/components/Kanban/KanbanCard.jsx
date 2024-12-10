import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Typography, Chip, Box, IconButton } from '@mui/material';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { AccessTime as AccessTimeIcon, Flag as FlagIcon, Delete as DeleteIcon } from '@mui/icons-material';

const KanbanCard = ({ card, index, onClick, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="kanban-card"
          data-priority={card.priority || 'medium'}
          onClick={onClick}
        >
          <div className="kanban-card-header">
            <Typography variant="subtitle2" gutterBottom onClick={onClick}>
              {card.title}
            </Typography>
            <IconButton 
              size="small" 
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
          
          {card.description && (
            <Typography 
              variant="body2" 
              color="textSecondary" 
              sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {card.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Chip
              icon={<FlagIcon />}
              label={card.priority}
              size="small"
              color={getPriorityColor(card.priority)}
            />
            
            {card.start_date && (
              <Chip
                icon={<AccessTimeIcon />}
                label={`Início: ${formatDate(card.start_date)}`}
                size="small"
                variant="outlined"
              />
            )}
            
            {card.due_date && (
              <Chip
                icon={<AccessTimeIcon />}
                label={`Término: ${formatDate(card.due_date)}`}
                size="small"
                variant="outlined"
                color={new Date(card.due_date) < new Date() ? 'error' : 'default'}
              />
            )}
          </Box>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard; 