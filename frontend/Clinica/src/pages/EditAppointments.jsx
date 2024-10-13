import React, { useEffect, useState } from 'react';
import { getPatients, getAppointments, updateAppointment, getMedicos, getConsultationType, getRol } from '../api/Clinica.api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function EditAppointments() {
    const [patients, setPatients] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedMedico, setSelectedMedico] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [medicos, setMedicos] = useState([]);
    const [consultation, setConsultation] = useState([]);
    const [listRol, setListRol] = useState([]);
    const [rol, setRol] = useState('');

    useEffect(() => {
        async function loadPatients() {
            const res = await getPatients();
            setPatients(res.data);
        }

        async function loadAppointments() {
            const res = await getAppointments();
            setAllAppointments(res.data);
            filterAppointments(res.data, selectedPatient, selectedMedico);
        }

        async function loadMedicos() {
            const res = await getMedicos();
            setMedicos(res.data);
        }

        async function loadConsultation() {
            const res = await getConsultationType();
            setConsultation(res.data);
        }

        async function loadRol() {
            const res = await getRol();
            setListRol(res.data);
        }

        async function loadData() {
            await Promise.all([loadAppointments(), loadPatients(), loadMedicos(), loadConsultation(), loadRol()]);
        }
        loadData();
    }, []);

    useEffect(() => {
        filterAppointments(allAppointments, selectedPatient, selectedMedico);
    }, [selectedPatient, selectedMedico, allAppointments]);

    const filterAppointments = (appointments, patientId, medicoId) => {
        if (patientId || medicoId) {
            const filtered = appointments.filter((appointment) => {
                const matchesPatient = patientId ? appointment.paciente === Number(patientId) : true;
                const matchesMedico = medicoId ? appointment.medico === Number(medicoId) : true;
                return matchesPatient && matchesMedico && appointment.estado === 'Programada';
            });
            setAppointments(filtered);
        } else {
            setAppointments([]); 
        }
    };

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
            filterAppointments(updatedAllAppointments, selectedPatient, selectedMedico);
        } catch (error) {
            console.error('Error al cancelar la cita:', error.response?.data || error);
            setUpdateMessage('Error al cancelar la cita. Inténtalo de nuevo.');
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
    
        doc.setFontSize(20);
    
        const tableColumn = ["Paciente", "Médico", "Fecha y Hora", "Tipo de Consulta", "Estado"];
        const tableRows = [];
    
        appointments.forEach(appointment => {
            const appointmentData = [
                getPatient(appointment.paciente),
                getMedico(appointment.medico),
                new Date(appointment.fecha_hora).toLocaleString(),
                getConsultation(appointment.tipo_consulta),
                appointment.estado
            ];
            tableRows.push(appointmentData);
        });
    
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30
        });

        let fileName = 'Historial_de_Citas_Médicas';
        let title = 'Listado de Citas Médicas';
        if (appointments.length > 0) {
            const firstAppointment = appointments[0];
            const patientName = getPatient(firstAppointment.paciente);
            const medicoName = getMedico(firstAppointment.medico);
            
            if (selectedPatient) {
                fileName += `_${patientName.replace(/\s+/g, '_')}`;
                title += ` ${patientName}`
            } else if (selectedMedico) {
                fileName += `_${medicoName.replace(/\s+/g, '_')}`;
                title += ` ${medicoName}`
            }
        }

        fileName += '.pdf';
        doc.text(title, 14, 22);
        doc.save(fileName);
        
    };
    
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Editar Citas</h2>
            {updateMessage && <div className="alert alert-success text-center">{updateMessage}</div>}

            <div className="form-group mb-4">
                <label htmlFor="patientSelect">Selecciona un Paciente:</label>
                <select
                    className="form-control"
                    id="patientSelect"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                >
                    <option value="">Elige un paciente</option>
                    {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                            {patient.nombre_completo}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group mb-4">
                <label htmlFor="medicoSelect">Selecciona un Médico:</label>
                <select
                    className="form-control"
                    id="medicoSelect"
                    value={selectedMedico}
                    onChange={(e) => setSelectedMedico(e.target.value)}
                >
                    <option value="">Elige un médico</option>
                    {medicos.map((medico) => (
                        <option key={medico.id} value={medico.id}>
                            {`${medico.nombres} ${medico.apellidos}`}
                        </option>
                    ))}
                </select>
            </div>

            <div className="table-responsive shadow-sm p-3 mb-5 bg-light rounded" id="appointments-table">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
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
                                    <td>{getMedico(appointment.medico)}</td>
                                    <td>{new Date(appointment.fecha_hora).toLocaleString()}</td>
                                    <td>{getConsultation(appointment.tipo_consulta)}</td>
                                    <td>
                                        <span className={`badge ${appointment.estado === 'Completada' ? 'bg-success' : 'bg-warning'}`}>
                                            {appointment.estado}
                                        </span>
                                    </td>
                                    <td>
                                        {appointment.estado === 'Programada' && (
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                        <button 
                                            className="btn btn-danger btn-sm" 
                                            onClick={exportToPDF}
                                        >
                                            Exportar
                                        </button>
                                    </td>
                                    
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No hay citas programadas para este paciente o médico.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
