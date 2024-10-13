import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AddAppointment } from './pages/AddAppointments';
import { ListAppointments } from './pages/ListAppointments';
import { AddPatient } from './pages/AddPatient';
import { AddUser } from './pages/AddUsers';
import { ManagePatients } from './pages/ManagePatients';
import { ListPatients } from './pages/ListPatients';
import { UpdatePatients } from './pages/UpdatePatients';
import { ManageUsers } from './pages/ManageUsers';
import { UpdateUsers } from './pages/UpdateUsers';
import { ListUsers } from './pages/ListUsers';
import { EditAppointments } from './pages/EditAppointments';
import { ManageAppoinments } from './pages/ManageAppoinments';
import { ManageMedicalRecords } from './pages/ManageMedicalRecords';
import { AddPrescriptions } from './pages/AddPrescriptions';
import { AddMedicalRecords } from './pages/AddMedicalRecords'

export default function App() {
    return (
        <Router>
            <div className="container">
                <h1>Gestión Clínica</h1> 
                <div className="mb-4">
                    <Link to="/manage-appointments" className="btn btn-primary me-2">Citas</Link>
                    <Link to="/manage-patient" className="btn btn-success me-2">Pacientes</Link>
                    <Link to="/manage-user" className="btn btn-warning">Usuarios</Link>
                    <Link to="/manage-medical-records" className="btn btn-warning">Historias Médicas</Link>
                </div>

                <Routes>
                    
                    <Route path="/add-appointment" element={<AddAppointment />} />
                    <Route path="/list-appointments" element={<ListAppointments />} />
                    <Route path="/manage-patient" element={<ManagePatients />} />
                    <Route path="/manage-user" element={<ManageUsers />} />
                    <Route path="/add-patient" element={<AddPatient />} />
                    <Route path="/add-user" element={<AddUser />} />
                    <Route path="/list-patient" element={<ListPatients />} />
                    <Route path="/update-patient" element={<UpdatePatients />} />
                    <Route path="/update-user" element={<UpdateUsers />} />
                    <Route path="/list-user" element={<ListUsers />} />
                    <Route path="/edit-appointments" element={<EditAppointments />} />
                    <Route path="/manage-appointments" element={<ManageAppoinments />} />
                    <Route path="/manage-medical-records" element={<ManageMedicalRecords />} />
                    <Route path="/add-medical-records" element={<AddMedicalRecords />} />
                </Routes>
            </div>
        </Router>
    );
}
