// ChartCard.js
import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Modal, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { formatCurrency, formatNumber, formatInteger } from '../utils/formatters';
import { motion } from 'framer-motion';

const ChartCard = ({ title, lineData = [], chartType, height = 300 }) => {
  console.log('ChartCard render:', { title, lineData, chartType });
  
  const [open, setOpen] = useState(false);

  // Verificação de segurança para dados vazios
  if (!lineData || lineData.length === 0) {
    return (
      <Card sx={{ height: '100%', borderRadius: '20px', padding: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>{title}</Typography>
          <Typography color="textSecondary">Sem dados disponíveis</Typography>
        </CardContent>
      </Card>
    );
  }

  const minValue = Math.min(...lineData.map((d) => d.value));
  const maxValue = Math.max(...lineData.map((d) => d.value));
  const yAxisDomain = [Math.floor(minValue * 0.9), Math.ceil(maxValue * 1.1)];

  const formatValue = (value, name) => {
    if (name.includes('Dinheiro') || name.includes('Vendas') || 
        name.includes('Despesas') || name.includes('Lucro')) {
      return formatCurrency(value);
    }
    if (name.includes('Clientes')) {
      return formatInteger(value);
    }
    return formatNumber(value);
  };

  const renderChart = (isModal) => {
    const chartHeight = isModal ? 400 : height;
    const chartWidth = '100%';

    return (
      <ResponsiveContainer width={chartWidth} height={chartHeight}>
        {chartType === 'line' && (
          <LineChart data={lineData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={yAxisDomain} tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => [formatValue(value, name), name]} 
              labelFormatter={(label) => `Data: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ 
                r: 6,
                stroke: '#8884d8',
                strokeWidth: 2,
                fill: '#fff'
              }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        )}
        {chartType === 'bar' && (
          <BarChart data={lineData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={yAxisDomain} tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => [formatValue(value, name), name]} 
              labelFormatter={(label) => `Data: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#8884d8"
              animationDuration={1500}
              animationEasing="ease-in-out"
            >
              {lineData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fillOpacity={0.8}
                  onMouseEnter={(e) => {
                    e.target.style.fillOpacity = 1;
                    e.target.style.transition = 'fill-opacity 0.3s';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.fillOpacity = 0.8;
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        )}
        {chartType === 'pie' && (
          <PieChart>
            <Pie 
              data={lineData} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={60} 
              fill="#8884d8" 
              label
              animationDuration={1500}
              animationEasing="ease-in-out"
            >
              {lineData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fillOpacity={0.8}
                  onMouseEnter={(e) => {
                    e.target.style.fillOpacity = 1;
                    e.target.style.transition = 'fill-opacity 0.3s';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.fillOpacity = 0.8;
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [formatValue(value, name), name]} 
              labelFormatter={(label) => `Data: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <>
      <motion.div
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          sx={{ 
            height: '100%', 
            borderRadius: '20px', 
            padding: 2, 
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
            margin: 1, 
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-4px)'
            }
          }}
        >
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="h6" component="div" gutterBottom>{title}</Typography>
            </motion.div>
            
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ height }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                style={{ width: '100%', height: '100%' }}
              >
                {renderChart(false)}
              </motion.div>
            </Box>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1
              }}
            >
              <IconButton 
                aria-label="zoom" 
                onClick={() => setOpen(true)} 
                sx={{ 
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'rgba(30, 30, 30, 0.9)'
                      : 'rgba(255, 255, 255, 0.9)',
                  color: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(0, 0, 0, 0.7)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(0,0,0,0.4)'
                      : '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(40, 40, 40, 0.95)'
                        : 'rgba(255, 255, 255, 1)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(0,0,0,0.6)'
                        : '0 4px 12px rgba(0,0,0,0.2)',
                    color: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 1)'
                        : 'rgba(0, 0, 0, 0.9)'
                  }
                }}
              >
                <ZoomInIcon />
              </IconButton>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        aria-labelledby="modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '80%', 
            maxWidth: 800, 
            bgcolor: 'background.paper', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)', 
            p: 4,
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                {title}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ width: '100%', height: '400px' }}
            >
              {renderChart(true)}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="contained" 
                onClick={() => setOpen(false)} 
                sx={{ 
                  mt: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }
                }}
              >
                Fechar
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Modal>
    </>
  );
};

export default ChartCard;
