import React, { useEffect, useState } from 'react';
import { getPatients, getAppointments, updateAppointment, getMedicos, getConsultationType } from '../api/Clinica.api';

export function EditAppointments() {
    const [patients, setPatients] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [medicos, setMedicos] = useState([]);
    const [consultation, setConsultation] = useState([]);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newDateTime, setNewDateTime] = useState('');

    useEffect(() => {
        async function loadData() {
            try {
                const [appointmentsRes, patientsRes, medicosRes, consultationRes] = await Promise.all([
                    getAppointments(),
                    getPatients(),
                    getMedicos(),
                    getConsultationType()
                ]);

                setAllAppointments(appointmentsRes.data);
                setPatients(patientsRes.data);
                setMedicos(medicosRes.data);
                setConsultation(consultationRes.data);
                filterAppointments(appointmentsRes.data, '');
            } catch (error) {
                console.error('Error loading data:', error);
                setUpdateMessage('Error al cargar los datos. Por favor, recarga la página.');
            }
        }
        loadData();
    }, []);

    const filterAppointments = (appointments, search) => {
        if (!search) {
            setAppointments(appointments.filter(app => app.estado === 'Programada'));
            return;
        }

        const searchLower = search.toLowerCase();
        const filtered = appointments.filter(appointment => {
            const patient = patients.find(p => p.id === appointment.paciente);
            const patientName = patient ? patient.nombre_completo.toLowerCase() : '';
            return patientName.includes(searchLower) && appointment.estado === 'Programada';
        });
        setAppointments(filtered);
    };

    useEffect(() => {
        filterAppointments(allAppointments, searchTerm);
    }, [searchTerm, allAppointments, patients]);

    const getPatient = (id) => {
        const patient = patients.find(p => p.id === id);
        return patient ? patient.nombre_completo : 'Desconocido';
    };

    const getMedico = (id) => {
        const medico = medicos.find(d => d.id === id);
        return medico ? `${medico.nombres} ${medico.apellidos}` : 'Desconocido';
    };

    const getConsultation = (id) => {
        const consult = consultation.find(c => c.id === id);
        return consult ? consult.nombre : 'Desconocido';
    };

    const handleCancelAppointment = async (id) => {
        try {
            const appointmentToUpdate = allAppointments.find(appointment => appointment.id === id);
            const updatedAppointment = {
                ...appointmentToUpdate,
                estado: 'Cancelada'
            };
    
            await updateAppointment(id, updatedAppointment);
            setUpdateMessage('Cita cancelada exitosamente!');
            setTimeout(() => setUpdateMessage(''), 3000);
            
            const updatedAllAppointments = allAppointments.filter(appointment => appointment.id !== id);
            setAllAppointments(updatedAllAppointments);
            filterAppointments(updatedAllAppointments, searchTerm);
        } catch (error) {
            console.error('Error al cancelar la cita:', error);
            setUpdateMessage('Error al cancelar la cita. Inténtalo de nuevo.');
        }
    };

    const handleReschedule = (appointment) => {
        setSelectedAppointment(appointment);
        setNewDateTime(appointment.fecha_hora.slice(0, 16)); // Format datetime for input
        setShowRescheduleModal(true);
    };

    const handleRescheduleSubmit = async () => {
        try {
            const updatedAppointment = {
                ...selectedAppointment,
                fecha_hora: newDateTime
            };
    
            await updateAppointment(selectedAppointment.id, updatedAppointment);
            setUpdateMessage('Cita reprogramada exitosamente!');
            
            const updatedAllAppointments = allAppointments.map(app => 
                app.id === selectedAppointment.id ? updatedAppointment : app
            );
            setAllAppointments(updatedAllAppointments);
            filterAppointments(updatedAllAppointments, searchTerm);
            
            setShowRescheduleModal(false);
            setTimeout(() => setUpdateMessage(''), 3000);
        } catch (error) {
            console.error('Error al reprogramar la cita:', error);
            setUpdateMessage('Error al reprogramar la cita. Inténtalo de nuevo.');
        }
    };
    
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Editar Citas</h2>
            {updateMessage && <div className="alert alert-success text-center">{updateMessage}</div>}

            <div className="form-group mb-4">
                <label htmlFor="searchInput">Buscar Paciente:</label>
                <input
                    type="text"
                    className="form-control"
                    id="searchInput"
                    placeholder="Ingrese el nombre del paciente"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-responsive shadow-sm p-3 mb-5 bg-light rounded">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Paciente</th>
                            <th>Médico</th>
                            <th>Fecha y Hora</th>
                            <th>Tipo de Consulta</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td>{getPatient(appointment.paciente)}</td>
                                    <td>{getMedico(appointment.medico)}</td>
                                    <td>{new Date(appointment.fecha_hora).toLocaleString()}</td>
                                    <td>{getConsultation(appointment.tipo_consulta)}</td>
                                    <td>
                                        <span className={`badge ${appointment.estado === 'Completada' ? 'bg-success' : 'bg-warning'}`}>
                                            {appointment.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            <button 
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleReschedule(appointment)}
                                            >
                                                Reprogramar
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No hay citas programadas para este paciente.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Reprogramación */}
            {showRescheduleModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reprogramar Cita</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowRescheduleModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Nueva Fecha y Hora:</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={newDateTime}
                                        onChange={(e) => setNewDateTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowRescheduleModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={handleRescheduleSubmit}
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showRescheduleModal && <div className="modal-backdrop show"></div>}
        </div>
    );
}