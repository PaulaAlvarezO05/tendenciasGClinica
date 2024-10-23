import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, AuthContext } from './api/AuthContext';
import { LoginForm } from './pages/LoginForm';
import MedicoPanel from './pages/MedicoPanel';
import { ListAppointments } from './pages/ListAppointments';
import { AddMedicalRecords } from './pages/AddMedicalRecords';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

const AppContent = () => {
  const { token, rol } = useContext(AuthContext);

  if (!token) {
    return <LoginForm />;
  }

  return (
    <Routes>
      <Route path="/" element={<RedirectBasedOnRole rol={rol} />} />
      
      <Route
        path="/medico"
        element={
          <ProtectedRoute>
            <MedicoPanel />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/list-appointments"
        element={
          <ProtectedRoute>
            <ListAppointments rol={rol} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/medical-record"
        element={
          <ProtectedRoute>
            <AddMedicalRecords/>
          </ProtectedRoute>
        }
      />
      

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const RedirectBasedOnRole = ({ rol }) => {
  if (rol === 'Médico') {
    return <Navigate to="/medico" />;
  }
  if (rol === 'Administrador') {
    return <Navigate to="/admin" />;
  }
  return <Navigate to="/" />;
};

export default App;