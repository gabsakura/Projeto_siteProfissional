// ChartCard.js
import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Modal, IconButton } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

const ChartCard = ({ title, lineData = [], chartType, height = 300 }) => {
  const [open, setOpen] = useState(false);

  // Verifica se lineData tem dados antes de calcular minValue e maxValue
  const minValue = lineData.length > 0 ? Math.min(...lineData.map((d) => d.value)) : 0;
  const maxValue = lineData.length > 0 ? Math.max(...lineData.map((d) => d.value)) : 1;
  const yAxisDomain = [Math.floor(minValue * 0.9), Math.ceil(maxValue * 1.1)];

  const renderChart = (isModal) => {
    const chartHeight = isModal ? 400 : height;
    const chartWidth = isModal ? '100%' : '95%';

    return (
      <ResponsiveContainer width={chartWidth} height={chartHeight}>
        {chartType === 'line' && (
          <LineChart data={lineData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={yAxisDomain} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        )}
        {chartType === 'bar' && (
          <BarChart data={lineData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={yAxisDomain} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        )}
        {chartType === 'pie' && (
          <PieChart>
            <Pie data={lineData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
              {lineData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#8884d8" />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <>
      <Card sx={{ height: '100%', borderRadius: '20px', padding: 2, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', margin: 1, position: 'relative' }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>{title}</Typography>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height }}>
            {renderChart(false)}
          </Box>
          <IconButton aria-label="zoom" onClick={() => setOpen(true)} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
            <ZoomInIcon />
          </IconButton>
        </CardContent>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-title">
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 800, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>{title}</Typography>
          {renderChart(true)}
          <Button variant="contained" onClick={() => setOpen(false)} sx={{ mt: 2 }}>Fechar</Button>
        </Box>
      </Modal>
    </>
  );
};

export default ChartCard;
