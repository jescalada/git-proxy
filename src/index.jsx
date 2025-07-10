import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './ui/auth/AuthProvider';

// core components
import Dashboard from './ui/layouts/Dashboard';
import Login from './ui/views/Login/Login';
import './ui/assets/css/material-dashboard-react.css';
import NotAuthorized from './ui/views/Extras/NotAuthorized';
import NotFound from './ui/views/Extras/NotFound';

// Create a basic theme (you can customize this later)
const theme = createTheme();

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/dashboard/*' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/not-authorized' element={<NotAuthorized />} />
            <Route path='/' element={<Navigate to='/dashboard/repo' />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
