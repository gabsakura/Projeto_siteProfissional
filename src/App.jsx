import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import KanbanBoard from './components/KanbanBoard';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import { Box, CssBaseline, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  const [darkMode, setDarkMode] = useState(false);

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
          <Sidebar /> {/* Barra lateral fixa em todas as páginas */}
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}
          >
            <Button variant="contained" onClick={() => setDarkMode(!darkMode)} sx={{ mb: 2 }}>
              {darkMode ? 'Modo Claro' : 'Modo Escuro'}
            </Button>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/kanban" element={<KanbanBoard />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
