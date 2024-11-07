// KanbanBoard.js
import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';

const initialTasks = {
  todo: ['Task 1', 'Task 2'],
  inProgress: ['Task 3'],
  done: ['Task 4'],
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = (task, from, to) => {
    setTasks((prevTasks) => {
      const updatedFrom = prevTasks[from].filter((t) => t !== task);
      const updatedTo = [...prevTasks[to], task];
      return { ...prevTasks, [from]: updatedFrom, [to]: updatedTo };
    });
  };

  return (
    <Grid container spacing={2}>
      {Object.keys(tasks).map((column) => (
        <Grid item xs={4} key={column}>
          <Card>
            <CardContent>
              <Typography variant="h6">{column}</Typography>
              {tasks[column].map((task) => (
                <div key={task}>
                  <Typography>{task}</Typography>
                  {column !== 'done' && (
                    <Button onClick={() => moveTask(task, column, 'done')}>Move to Done</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KanbanBoard;
