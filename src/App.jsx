import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import { checkAuth } from './services/api';

// Lazy loading dos componentes
const LoginForm = React.lazy(() => import('./components/LoginForm'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Sidebar = React.lazy(() => import('./components/Sidebar'));
// ... outros imports lazy

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const { token, user } = checkAuth();
      if (token && user) {
        setIsLoggedIn(true);
        setUser(user);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

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
      }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease',
            backgroundImage: 'none',
          },
        },
      }
    }
  });

  if (isLoading) {
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
          <Suspense fallback={<CircularProgress />}>
            <Box sx={{ display: 'flex' }}>
              {isLoggedIn && <Sidebar /* props */ />}
              <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh' }}>
                <Routes>
                  <Route 
                    path="/login" 
                    element={!isLoggedIn ? <LoginForm /> : <Navigate to="/dashboard" replace />} 
                  />
                  <Route 
                    path="/" 
                    element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} 
                  />
                  <Route 
                    path="/dashboard" 
                    element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} 
                  />
                  {/* ... outras rotas */}
                </Routes>
              </Box>
            </Box>
          </Suspense>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
