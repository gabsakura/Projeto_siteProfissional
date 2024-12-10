import React, { useState, useEffect } from 'react';
import {
  Grid, Box, Tabs, Tab, TextField, Button, Typography, Card, CardContent, Divider, Stack, IconButton,
} from '@mui/material';
import ChartCard from './ChartCard';
import axios from 'axios';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MonetizationOnIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import Inventory from './Inventory';
import api from '../services/api';

// Função para calcular a mudança percentual
const calculateChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

// Função para formatar a data
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
};

// Hook personalizado para gerenciar dados financeiros
const useFinancialData = (startDate, endDate) => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/financial_data', {
          params: { startDate, endDate }
        });

        const filteredData = Array.isArray(response.data.data)
          ? response.data.data.filter(item => {
              const itemDate = new Date(item.timestamp);
              const start = new Date(startDate);
              const end = new Date(endDate);
              return itemDate >= start && itemDate <= end;
            })
          : [];

        const sortedData = filteredData.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        
        setFinancialData(sortedData);
      } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
        setError('Erro ao carregar dados financeiros');
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchFinancialData();
    }
  }, [startDate, endDate]);

  return { financialData, loading, error };
};

const Dashboard = () => {
  const [chartType, setChartType] = useState('line');
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { financialData, loading, error } = useFinancialData(startDate, endDate);

  const setDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days + 1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  useEffect(() => {
    setDateRange(7);
  }, []);

  const getSummaryData = () => {
    if (financialData.length === 0) return null;

    const total = (key) => financialData.reduce((acc, item) => acc + Number(item[key]), 0);

    return [
      {
        title: 'Total em Dinheiro',
        value: `R$ ${total('total_money').toFixed(2)}`,
        icon: <MonetizationOnIcon />,
        color: '#2196f3'
      },
      {
        title: 'Total de Clientes',
        value: Math.round(total('total_customers')),
        icon: <PeopleIcon />,
        color: '#9c27b0'
      },
      {
        title: 'Vendas',
        value: `R$ ${total('sales').toFixed(2)}`,
        icon: <ReceiptIcon />,
        color: '#4caf50'
      },
      {
        title: 'Despesas',
        value: `R$ ${total('expenses').toFixed(2)}`,
        icon: <PaymentIcon />,
        color: '#f44336'
      },
      {
        title: 'Novos Clientes',
        value: Math.round(total('new_customers')),
        icon: <PeopleIcon />,
        color: '#ff9800'
      },
    ];
  };

  const financialDataMapping = [
    { 
      label: 'Total em Dinheiro', 
      data: financialData.map(item => ({ 
        name: formatDate(item.timestamp), 
        value: Number(item.total_money).toFixed(2)
      })) 
    },
    { 
      label: 'Total de Clientes', 
      data: financialData.map(item => ({ 
        name: formatDate(item.timestamp), 
        value: Math.round(Number(item.total_customers))
      })) 
    },
    { 
      label: 'Lucro', 
      data: financialData.map(item => ({ 
        name: formatDate(item.timestamp), 
        value: Number(item.profit).toFixed(2)
      })) 
    },
    { 
      label: 'Vendas', 
      data: financialData.map(item => ({ 
        name: formatDate(item.timestamp), 
        value: Number(item.sales).toFixed(2)
      })) 
    },
    { 
      label: 'Despesas', 
      data: financialData.map(item => ({ 
        name: formatDate(item.timestamp), 
        value: Number(item.expenses).toFixed(2)
      })) 
    },
    { 
      label: 'Novos Clientes', 
      data: financialData.map(item => ({ 
        name: formatDate(item.timestamp), 
        value: Math.round(Number(item.new_customers))
      })) 
    },
  ];

  return (
    <Box sx={{ 
      padding: { xs: 1, sm: 2 }, 
      width: '100%', 
      overflowX: 'hidden', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 1.5 
    }}>
      <Card sx={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        mb: 1.5 
      }}>
        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ 
              minHeight: '42px',
              '& .MuiTab-root': { 
                minHeight: '42px',
                py: 0.5
              }
            }}
          >
            <Tab label="Dashboard" />
            <Tab label="Inventário" />
          </Tabs>
        </CardContent>
      </Card>

      {tabValue === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Card sx={{ 
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1rem' }}>Período: {startDate} a {endDate}</Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={1.5} 
                alignItems="center"
              >
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setDateRange(7)}
                    size="small"
                    sx={{ 
                      minWidth: '100px',
                      height: '32px'
                    }}
                  >
                    7 dias
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => setDateRange(15)}
                    size="small"
                    sx={{ 
                      minWidth: '100px',
                      height: '32px'
                    }}
                  >
                    15 dias
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => setDateRange(30)}
                    size="small"
                    sx={{ 
                      minWidth: '100px',
                      height: '32px'
                    }}
                  >
                    30 dias
                  </Button>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={1}
                  width={{ xs: '100%', sm: 'auto' }}
                >
                  <TextField
                    label="Início"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ width: { xs: '100%', sm: '140px' } }}
                  />
                  <TextField
                    label="Fim"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ width: { xs: '100%', sm: '140px' } }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={() => useFinancialData(startDate, endDate)}
                    size="small"
                    sx={{ height: '40px' }}
                  >
                    Aplicar
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={1.5}>
            {getSummaryData()?.map((item, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <Card sx={{ 
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }
                }}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography color="textSecondary" variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {item.title}
                      </Typography>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          backgroundColor: `${item.color}15`, 
                          color: item.color,
                          width: 28,
                          height: 28
                        }}
                      >
                        {item.icon}
                      </IconButton>
                    </Box>
                    <Typography variant="h6" component="div" sx={{ mb: 0.5, fontSize: '1.1rem' }}>
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={1.5}>
            {financialDataMapping.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ChartCard 
                  title={item.label} 
                  lineData={item.data} 
                  chartType={chartType} 
                  height={180} 
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {tabValue === 1 && (
        <Inventory />
      )}
    </Box>
  );
};

export default Dashboard;
