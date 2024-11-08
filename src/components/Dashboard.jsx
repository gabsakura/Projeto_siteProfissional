import React, { useState, useEffect } from 'react';
import {
  Grid, Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, Typography, Modal
} from '@mui/material';
import ChartCard from './ChartCard';
import axios from 'axios';

const Dashboard = () => {
  const [chartType, setChartType] = useState('line');
  const [financialData, setFinancialData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [editedInventory, setEditedInventory] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [modalData, setModalData] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    setStartDate(lastWeek.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  const fetchFinancialData = async () => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get('http://localhost:5000/api/financial_data', { params });
      setFinancialData(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
      setFinancialData([]);
    }
  };

  const fetchInventoryData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inventory');
      const data = response.data.data || [];
      setInventoryData(data);
      setEditedInventory(data.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {}));
    } catch (error) {
      console.error('Erro ao buscar dados de inventário:', error);
      setInventoryData([]);
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    setEditedInventory(prevState => ({
      ...prevState,
      [id]: newQuantity
    }));
  };

  const updateInventory = async () => {
    const updates = Object.keys(editedInventory).map(id => ({
      id,
      quantity: editedInventory[id]
    }));

    try {
      await Promise.all(
        updates.map(item =>
          axios.put(`http://localhost:5000/api/inventory/${item.id}`, { quantity: item.quantity })
        )
      );
      fetchInventoryData();
      alert("Inventário atualizado com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar o inventário:', error);
      alert("Erro ao atualizar o inventário.");
    }
  };

  const addInventoryItem = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/inventory', {
        item: newItemName,
        quantity: newItemQuantity
      });
      if (response.status === 201) {
        setNewItemName('');
        setNewItemQuantity('');
        fetchInventoryData();
        alert("Item adicionado com sucesso!");
      } else {
        console.error(`Erro ao adicionar item: Status ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert("Erro ao adicionar o item.");
    }
  };

  const deleteInventoryItem = async (id) => {
    axios.delete(`http://localhost:5000/api/inventory/${id}`)
    .then(response => {
      console.log('Item deletado com sucesso:', response.data);
      fetchInventory();
      // Lógica para atualizar a lista de itens, se necessário
    })
    .catch(error => {
      console.error("Erro ao remover item:", error);
    });
};

  const openModal = (data) => setModalData(data);
  const closeModal = () => setModalData(null);

  useEffect(() => {
    fetchFinancialData();
    fetchInventoryData();
  }, [startDate, endDate]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const totalMoneyData = financialData.map(item => ({ name: formatDate(item.timestamp), value: item.total_money }));
  const profitData = financialData.map(item => ({ name: formatDate(item.timestamp), value: item.profit }));
  const salesData = financialData.map(item => ({ name: formatDate(item.timestamp), value: item.sales }));
  const expensesData = financialData.map(item => ({ name: formatDate(item.timestamp), value: item.expenses }));
  const buyersData = financialData.map(item => ({ name: formatDate(item.timestamp), value: item.new_customers }));

  return (
    <Box sx={{ padding: 3, width: '100%', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Dashboard" />
        <Tab label="Inventário" />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ marginTop: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <TextField
              label="Data de Início"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data de Término"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" onClick={fetchFinancialData}>
              Aplicar Filtros
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ position: 'relative' }}>
                <ChartCard title="Total em Dinheiro" lineData={totalMoneyData} chartType={chartType} height={200} />
              </Box>
            </Grid>

            {[profitData, salesData, expensesData, buyersData].map((data, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ChartCard title={["Lucro", "Vendas", "Despesas", "Novos Clientes"][index]} lineData={data} chartType={chartType} height={200} />
              </Grid>
            ))}
          </Grid>

          <Modal open={Boolean(modalData)} onClose={closeModal}>
            <Box sx={{ width: '80%', height: '80%', margin: 'auto', marginTop: '5%', backgroundColor: 'white', padding: 2 }}>
              <ChartCard title="Gráfico Ampliado" lineData={modalData} chartType={chartType} height={400} />
            </Box>
          </Modal>
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ marginTop: 2 }}>

          
          <Typography variant="h6" sx={{ marginBottom: 2 }}>Dados do Inventário</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
            <TextField
              label="Novo Item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <TextField
              label="Quantidade"
              type="number"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(Number(e.target.value))}
            />
            <Button variant="contained" color="primary" onClick={addInventoryItem}>
              Adicionar Item
            </Button>
            <Button variant="contained" color="secondary" onClick={updateInventory}>
              Salvar Alterações
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryData.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={editedInventory[item.id] || ''}
                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                        sx={{ width: '100px' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" color="secondary" onClick={() => deleteInventoryItem(item.id)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
