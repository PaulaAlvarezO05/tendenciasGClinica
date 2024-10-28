import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, AuthContext } from './api/AuthContext';
import { LoginForm } from './pages/LoginForm';
import MedicoPanel from './pages/MedicoPanel';
import AdminPanel from './pages/AdminPanel';
import AsistentePanel from './pages/AsistentePanel';
import { AddAppointment } from './pages/AddAppointments';
import { EditAppointments } from './pages/EditAppointments'
import { ListAppointments } from './pages/ListAppointments';
import { AddMedicalRecords } from './pages/AddMedicalRecords';
import { ListPatients } from './pages/ListPatients';
import { UpdatePatients } from './pages/UpdatePatients';
import { ListUsers } from './pages/ListUsers';
import { UpdateUsers } from './pages/updateUsers';
import { ListMedicalRecordPatients } from './pages/ListMedicalRecordPatients'
import { GeneralMedicalRecords } from './pages/GeneralMedicalRecords'
import { DetalleMedicalRecords } from './pages/DetalleMedicalRecords';
import {ListBillings} from './pages/Billing';
import { ManagePatients} from './pages/ManagePatients';
import { AddPatient } from './pages/AddPatient';
import { ManageUsers } from './pages/ManageUsers';
import { AddUser} from './pages/AddUsers';
import  MedicationInventory  from './pages/Medication';

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
      {/*Paneles basados en el rol*/}
      <Route path="/medico" element={<ProtectedRoute><MedicoPanel /></ProtectedRoute>}/>
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}/>
      <Route path="/asistente-admin" element={<ProtectedRoute><AsistentePanel /></ProtectedRoute>}/>
      
      {/*Acciones*/}
      <Route path="/add-appointment" element={<ProtectedRoute><AddAppointment rol={rol}/></ProtectedRoute>}/>
      <Route path="/edit-appointments" element={<ProtectedRoute><EditAppointments rol={rol}/></ProtectedRoute>} />
      <Route path="/list-appointments" element={<ProtectedRoute><ListAppointments rol={rol}/></ProtectedRoute>}/>
      <Route path="/medical-record" element={<ProtectedRoute><AddMedicalRecords/></ProtectedRoute>}/>
      <Route path="/list-patient" element={<ProtectedRoute><ListPatients/></ProtectedRoute>} />
      <Route path="/update-patient" element={<ProtectedRoute><UpdatePatients/></ProtectedRoute>} />
      <Route path="/list-user" element={<ProtectedRoute><ListUsers /></ProtectedRoute>}/>
      <Route path="/update-user" element={<ProtectedRoute><UpdateUsers/></ProtectedRoute>}/>
      <Route path="/list-medical-records-patients" element={<ProtectedRoute><ListMedicalRecordPatients/></ProtectedRoute>} />
      <Route path="/general-medical-records" element={<ProtectedRoute><GeneralMedicalRecords/></ProtectedRoute>} />
      <Route path="/list-medical-records" element={<ProtectedRoute><DetalleMedicalRecords/></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><ListBillings/></ProtectedRoute>} />
      <Route path="/manage-patients" element={<ProtectedRoute><ManagePatients/></ProtectedRoute>} />
      <Route path="/add-patient" element={<ProtectedRoute><AddPatient/></ProtectedRoute>} />
      <Route path="/manage-user" element={<ProtectedRoute><ManageUsers/></ProtectedRoute>} />
      <Route path="/add-user" element={<ProtectedRoute><AddUser/></ProtectedRoute>} />
      <Route path="/medication" element={<ProtectedRoute><MedicationInventory/></ProtectedRoute>} />
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
  if (rol === 'Asistente Administrativo') {
    return <Navigate to="/asistente-admin" />;
  }
  return <Navigate to="/" />;
};

export default App;