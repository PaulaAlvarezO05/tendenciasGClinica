import { useEffect, useState } from 'react';
import { getAppointments, getPatients, getMedicos, getConsultationType } from '../api/Clinica.api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { NavigationBar } from '../components/NavigationBar';

export function ListAppointments({ rol }) {
    const [allAppointments, setAllAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [consultation, setConsultation] = useState([]);
    const [searchPatient, setSearchPatient] = useState('');
    const [searchMedico, setSearchMedico] = useState('');
    const navigate = useNavigate();

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
                setFilteredAppointments(appointmentsRes.data);
                setPatients(patientsRes.data);
                setMedicos(medicosRes.data);
                setConsultation(consultationRes.data);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        filterAppointments();
    }, [searchPatient, searchMedico, allAppointments]);

    const filterAppointments = () => {
        let filtered = [...allAppointments];

        if (searchPatient) {
            const searchTermPatient = searchPatient.toLowerCase();
            filtered = filtered.filter(appointment => {
                const patient = getPatient(appointment.paciente);
                return patient.toLowerCase().includes(searchTermPatient);
            });
        }

        if (searchMedico) {
            const searchTermMedico = searchMedico.toLowerCase();
            filtered = filtered.filter(appointment => {
                const medico = getMedico(appointment.medico);
                return medico.toLowerCase().includes(searchTermMedico);
            });
        }

        setFilteredAppointments(filtered);
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

    const exportToPDF = (appointments = filteredAppointments) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Listado de Citas Médicas', 14, 22);

        const tableColumn = ["Paciente", "Médico", "Fecha y Hora", "Tipo de Consulta", "Estado"];
        const tableRows = appointments.map(appointment => [
            getPatient(appointment.paciente),
            getMedico(appointment.medico),
            new Date(appointment.fecha_hora).toLocaleString(),
            getConsultation(appointment.tipo_consulta),
            appointment.estado
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30
        });

        const fileName = appointments.length === 1 
            ? `Cita_${getPatient(appointments[0].paciente)}_${new Date(appointments[0].fecha_hora).toLocaleDateString()}.pdf`
            : 'Historial_de_Citas_Médicas.pdf';

        doc.save(fileName);
    };

    const handleExportSingleAppointment = (appointment) => {
        exportToPDF([appointment]);
    };

    const handleAddMedicalRecord = (patientId, medicoId, appointmentId) => {
        navigate('/medical-record', { state: { patientId, medicoId, appointmentId } });
    };
    
    return (
        <div><NavigationBar title={"Historial de Citas Médicas"}/>
            <div className="container mt-4">
                {rol !== 'Médico' && (
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="searchPatient">Buscar Paciente:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchPatient"
                                    value={searchPatient}
                                    onChange={(e) => setSearchPatient(e.target.value)}
                                    placeholder="Ingrese nombre del paciente"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="searchMedico">Buscar Médico:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchMedico"
                                    value={searchMedico}
                                    onChange={(e) => setSearchMedico(e.target.value)}
                                    placeholder="Ingrese nombre del médico"
                                />
                            </div>
                        </div>
                    </div>
                )}
        
                <div className="table-responsive shadow-sm p-3 mb-5 bg-white rounded">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                {rol === 'Médico' ? (
                                    <>
                                        <th>Paciente</th>
                                        <th>Fecha y Hora</th>
                                        <th>Acciones</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Paciente</th>
                                        <th>Médico</th>
                                        <th>Fecha y Hora</th>
                                        <th>Tipo de Consulta</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{getPatient(appointment.paciente)}</td>
                                    {rol !== 'Médico' && <td>{getMedico(appointment.medico)}</td>}
                                    <td>{new Date(appointment.fecha_hora).toLocaleString()}</td>
                                    {rol === 'Médico' ? (
                                        <td>
                                            <button 
                                                className={`btn ${
                                                    appointment.estado === 'Completada' 
                                                        ? 'btn-success'
                                                        : appointment.estado === 'Programada' 
                                                            ? 'btn-warning'
                                                            : 'btn-danger'
                                                }`}
                                                onClick={() => handleAddMedicalRecord(
                                                    appointment.paciente, 
                                                    appointment.medico,
                                                    appointment.id
                                                )}
                                                disabled={appointment.estado === 'Completada' || appointment.estado === 'Cancelada'}
                                            >
                                                {appointment.estado === 'Completada' 
                                                    ? 'Completada' 
                                                    : appointment.estado === 'Cancelada' 
                                                        ? 'Cancelada' 
                                                        : 'Gestionar'}
                                            </button>
                                        </td>
                                    ) : (
                                        <>
                                            <td>{getConsultation(appointment.tipo_consulta)}</td>
                                            <td>
                                                <span className={`badge ${
                                                    appointment.estado === 'Completada' 
                                                        ? 'bg-success' 
                                                        : appointment.estado === 'Programada' 
                                                            ? 'bg-warning' 
                                                            : 'bg-danger'
                                                }`}>
                                                    {appointment.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => handleExportSingleAppointment(appointment)}
                                                >
                                                    <i className="fas fa-file-export"></i> Exportar
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {rol !== 'Médico' && filteredAppointments.length > 0 && (
                    <div className="text-end mb-3">
                        <button 
                            className="btn btn-primary btn-lg"
                            onClick={() => exportToPDF()}
                        >
                            <i className="fas fa-file-export"></i> Exportar Todo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
    
}