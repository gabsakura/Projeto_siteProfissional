import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UserNotifications from './components/UserNotifications';
import KanbanBoard from './components/KanbanBoard';
import Sidebar from './components/Sidebar';
import LoginForm from './components/LoginForm';
import AdminNotifications from './components/AdminNotifications';
import Register from './components/Register';
import { Box, CssBaseline, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Controle para simular admin/user
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (admin) => {
    setIsAdmin(admin);
    setIsLoggedIn(true);
  };

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
          {isLoggedIn && <Sidebar isAdmin={isAdmin} />}
          <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
            <Button variant="contained" onClick={() => setDarkMode(!darkMode)} sx={{ mb: 2 }}>
              {darkMode ? 'Modo Claro' : 'Modo Escuro'}
            </Button>
            <Routes>
              <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginForm onLogin={handleLogin} />} />
              <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
              <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
              <Route path="/notifications" element={isLoggedIn ? <UserNotifications /> : <Navigate to="/" />} />
              <Route path="/kanban" element={isLoggedIn ? <KanbanBoard /> : <Navigate to="/" />} />
              {isAdmin ? (
                <>
                  <Route path="/admin-notifications" element={<AdminNotifications />} />
                  <Route path="/register" element={<Register />} />
                </>
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
