import React from 'react';
import { Link } from 'react-router-dom';

export function ManageMedicalRecords() {
    return (
        <div className="container">
            <h2 style={{ marginBottom: '30px' }}>Gestión de Historias Médicas</h2>
            <div className="btn-group" role="group" aria-label="Pacientes" style={{ display: 'flex', gap: '10px' }}>
                <Link to="/add-Medical-Records" className="btn" style={{ backgroundColor: '#A8E6CF', color: '#004D40', borderRadius: '20px', padding: '10px 20px' }}>Registrar Historias Clínicas</Link>
                <Link to="/edit-appointments" className="btn" style={{ backgroundColor: '#DCEDC8', color: '#33691E', borderRadius: '20px', padding: '10px 20px' }}>Cancelar Citas</Link>
                <Link to="/list-appointments" className="btn" style={{ backgroundColor: '#AED581', color: '#558B2F', borderRadius: '20px', padding: '10px 20px' }}>Listar Citas</Link>
            </div>
        </div>
    );
}