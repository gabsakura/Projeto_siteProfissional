import React, { useState, useEffect } from 'react';
import {
  Grid, Box, Tabs, Tab, TextField, Button, Typography, Card, CardContent, 
  Divider, Stack, CircularProgress
} from '@mui/material';
import { financialAPI } from '../services/api';

// Funções auxiliares
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
};

const calculateChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

const Dashboard = () => {
  // Estados
  const [chartType, setChartType] = useState('line');
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState([]);
  const [chartData, setChartData] = useState({
    totalCash: [],
    customers: [],
    profit: [],
    sales: [],
    expenses: [],
    newCustomers: []
  });

  // Handlers
  const handleQuickFilter = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days + 1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  // Efeitos
  useEffect(() => {
    handleQuickFilter(7);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await financialAPI.getChartData();
        setChartData(data);
        setFinancialData(data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 1, sm: 2 }, width: '100%' }}>
      {/* Resto do seu JSX */}
    </Box>
  );
};

export default Dashboard;
