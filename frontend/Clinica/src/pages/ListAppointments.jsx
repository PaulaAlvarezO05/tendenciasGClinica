import { useEffect, useState } from 'react';
import { getAppointments, getPatients, getMedicos, getConsultationType } from '../api/Clinica.api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { NavigationBar } from '../components/NavigationBar';
import { UserSearch, Stethoscope, Download } from 'lucide-react';

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
                console.error('Error al cargar los datos:', error);
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

    const handleAddMedicalRecord = (patientId, medicoId, appointmentId) => {
        navigate('/medical-record', { state: { patientId, medicoId, appointmentId } });
    };

    return (
        <div><NavigationBar title={"Historial de Citas Médicas"} />
            <div className="container mt-4">

                {rol !== 'Médico' && (
                    <div className="row mb-4">
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="searchPatient" className='fw-bold'>Paciente:</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <UserSearch size={20} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="searchPatient"
                                        value={searchPatient}
                                        onChange={(e) => setSearchPatient(e.target.value)}
                                        placeholder="Buscar paciente..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="searchMedico" className='fw-bold'>Médico:</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Stethoscope size={20} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="searchMedico"
                                        value={searchMedico}
                                        onChange={(e) => setSearchMedico(e.target.value)}
                                        placeholder="Buscar médico..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label style={{ color: '#9FC2AE' }}>Exportar</label>
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={() => exportToPDF()}
                                >
                                    <Download className="me-2" size={20} />Exportar PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="table-responsive shadow-sm p-3 mb-4 bg-white rounded">
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
                                                className={`btn ${appointment.estado === 'Completada'
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
                                                <span className={`badge ${appointment.estado === 'Completada'
                                                        ? 'bg-success'
                                                        : appointment.estado === 'Programada'
                                                            ? 'bg-warning'
                                                            : 'bg-danger'
                                                    }`}>
                                                    {appointment.estado}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-info btn-sm"
                                                    onClick={() => exportToPDF([appointment])}
                                                >
                                                    <i className="fas fa-file-export"></i> <Download />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}