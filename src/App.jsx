import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UserNotifications from './components/UserNotifications';
import KanbanBoard from './components/KanbanBoard';
import Sidebar from './components/Sidebar';
import LoginForm from './components/LoginForm';
import AdminNotifications from './components/AdminNotifications';
import Register from './components/Register';
import UserManagement from './components/UserManagement';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && savedUser) {
      setIsLoggedIn(true);
      setUser(savedUser);
    }
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
    },
  });

  return (
    <ThemeProvider theme={theme}>
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
                  isLoggedIn ? <Dashboard /> : <Navigate to="/login" />
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
                  isLoggedIn ? <KanbanBoard /> : <Navigate to="/login" />
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
    </ThemeProvider>
  );
}

export default App;
