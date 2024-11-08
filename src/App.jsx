// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UserNotifications from './components/UserNotifications';
import KanbanBoard from './components/KanbanBoard';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import AdminNotifications from './components/AdminNotifications';
import { Box, CssBaseline, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Controle para simular admin/user

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar isAdmin={isAdmin} /> {/* Passa isAdmin para o Sidebar */}
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}
          >
            <Button variant="contained" onClick={() => setDarkMode(!darkMode)} sx={{ mb: 2 }}>
              {darkMode ? 'Modo Claro' : 'Modo Escuro'}
            </Button>

            <Button
              variant="contained"
              color={isAdmin ? 'secondary' : 'primary'}
              onClick={() => setIsAdmin(!isAdmin)}
              sx={{ ml: 2, mb: 2 }}
            >
              {isAdmin ? 'Entrar como Usuário' : 'Entrar como Admin'}
            </Button>

            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<UserNotifications />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              {isAdmin ? (
                <Route path="/admin-notifications" element={<AdminNotifications />} />
              ) : (
                <Route path="/admin-notifications" element={<Navigate to="/" />} />
              )}
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
