
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StylesProvider, jssPreset } from '@mui/styles';
import { create } from 'jss';
import { AuthProvider } from './ui/auth/AuthProvider';

// core components
import Dashboard from './ui/layouts/Dashboard';
import Login from './ui/views/Login/Login';
import './ui/assets/css/material-dashboard-react.css';
import NotAuthorized from './ui/views/Extras/NotAuthorized';
import NotFound from './ui/views/Extras/NotFound';
import ErrorBoundary from './ui/components/ErrorBoundary/ErrorBoundary';

const theme = createTheme();

const jss = create(jssPreset());

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
  <React.StrictMode>
    <StylesProvider jss={jss}>
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
      </StylesProvider>
    </React.StrictMode>
  </ErrorBoundary>
);
