import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UserNotifications from './components/UserNotifications';
import KanbanBoard from './components/Kanban/KanbanBoard';
import Sidebar from './components/Sidebar';
import LoginForm from './components/LoginForm';
import AdminNotifications from './components/AdminNotifications';
import Register from './components/Register';
import UserManagement from './components/UserManagement';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

// Certifique-se que suas URLs de API estão configuradas corretamente
const API_URL = import.meta.env.VITE_API_URL || 'https://siteprof-backend.onrender.com';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (token && savedUser) {
        setIsLoggedIn(true);
        setUser(savedUser);
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#f5f7f9',
        paper: darkMode ? '#1E1E1E' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#2c3e50',
        secondary: darkMode ? '#b0b3b8' : '#64748b',
      },
      divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      action: {
        hover: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        selected: darkMode ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease',
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
          },
        },
      },
    },
  });

  if (isInitializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex' }}>
            {isLoggedIn && (
              <Sidebar 
                isAdmin={user?.tipo === 'admin'} 
                darkMode={darkMode} 
                toggleDarkMode={() => setDarkMode(!darkMode)}
                onLogout={handleLogout}
              />
            )}
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1,
                minHeight: '100vh',
                backgroundColor: 'background.default',
                pt: 2
              }}
            >
              <Routes>
                <Route 
                  path="/login" 
                  element={
                    !isLoggedIn ? (
                      <LoginForm onLogin={handleLogin} />
                    ) : (
                      <Navigate to="/dashboard" />
                    )
                  } 
                />
                <Route 
                  path="/" 
                  element={
                    isLoggedIn ? (
                      <Navigate to="/dashboard" />
                    ) : (
                      <Navigate to="/login" />
                    )
                  } 
                />

                {/* Rotas protegidas */}
                <Route
                  path="/dashboard"
                  element={
                    isLoggedIn ? <PrivateRoute><Dashboard /></PrivateRoute> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    isLoggedIn ? <Profile /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    isLoggedIn ? <UserNotifications /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/kanban"
                  element={
                    isLoggedIn ? <PrivateRoute><KanbanBoard /></PrivateRoute> : <Navigate to="/login" />
                  }
                />

                {/* Rotas de admin */}
                {user?.tipo === 'admin' && (
                  <>
                    <Route
                      path="/admin/users"
                      element={
                        isLoggedIn ? <UserManagement /> : <Navigate to="/login" />
                      }
                    />
                    <Route
                      path="/admin-notifications"
                      element={
                        isLoggedIn ? <AdminNotifications /> : <Navigate to="/login" />
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        isLoggedIn ? <Register /> : <Navigate to="/login" />
                      }
                    />
                  </>
                )}

                {/* Rota para qualquer outro caminho não definido */}
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
