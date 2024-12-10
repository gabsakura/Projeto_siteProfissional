import React from 'react';
import { Typography, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ column, cards, provided, onCardClick, onDeleteCard, onDeleteColumn }) => {
  return (
    <>
      <div className="kanban-column-header">
        <div className="kanban-column-title">
          <Typography variant="h6">{column.title}</Typography>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => onDeleteColumn(column.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      <div className="kanban-cards">
        {cards.map((card, index) => (
          <KanbanCard
            key={card.id}
            card={card}
            index={index}
            onClick={() => onCardClick(card)}
            onDelete={onDeleteCard}
          />
        ))}
      </div>
    </>
  );
};

export default KanbanColumn; 