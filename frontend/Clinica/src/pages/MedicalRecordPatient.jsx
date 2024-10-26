import { useEffect, useState } from 'react';
import { getMedicos, getMedicalRecords } from '../api/Clinica.api';
import { NavigationBar } from '../components/NavigationBar';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download } from 'lucide-react';
import ListMedicalRecord from './ListMedicalRecords'; // Importa el componente ListMedicalRecord

export function MedicalRecordPatient() {
    const location = useLocation();
    const { patient } = location.state || {};
    const [listMedicalRecords, setListMedicalRecords] = useState([]);
    const [listMedicos, setListMedicos] = useState([]);
    const [showListMedicalRecord, setShowListMedicalRecord] = useState(false); // Estado para mostrar ListMedicalRecord
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState(null);

    const patient_id = patient?.id;

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [medicalRecordsRes, medicosRes] = await Promise.all([
                    getMedicalRecords(),
                    getMedicos()
                ]);

                const filteredRecords = medicalRecordsRes.data.filter(
                    record => record.paciente === patient_id
                );
                setListMedicalRecords(filteredRecords);
                setListMedicos(medicosRes.data);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setError("Error al cargar la información. Por favor, intente nuevamente.");
            } finally {
                setLoading(false);
            }
        }

        if (patient_id) {
            loadData();
        }
    }, [patient_id]);

    const getMedico = (id) => {
        const medico = listMedicos.find(d => d.id === id);
        return medico ? `${medico.nombres} ${medico.apellidos}` : 'Desconocido';
    };

    const handleMedicalRecordPatient = (medicalRecord) => {
        setSelectedMedicalRecord(medicalRecord);
        setShowListMedicalRecord(true); // Cambiar el estado para mostrar ListMedicalRecord
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Información del paciente
        doc.setFontSize(16);
        doc.text('Historia Clínica del Paciente', 14, 20);

        doc.setFontSize(12);
        doc.text(`Nombre: ${patient.nombre_completo}`, 14, 30);
        doc.text(`Fecha de Nacimiento: ${patient.fecha_nacimiento}`, 14, 40);
        doc.text(`Género: ${patient.genero}`, 14, 50);
        doc.text(`Dirección: ${patient.direccion}`, 14, 60);

        // Antecedentes médicos
        doc.setFontSize(14);
        doc.text('Antecedentes Médicos', 14, 80);

        const tableData = listMedicalRecords.map(record => [
            new Date(record.fecha_registro).toLocaleDateString(),
            getMedico(record.medico),
            record.descripcion_diagnostico
        ]);

        doc.autoTable({
            startY: 90,
            head: [['Fecha', 'Médico', 'Diagnóstico']],
            body: tableData,
        });

        // Guardar el PDF
        doc.save(`historia_clinica_${patient.nombre_completo}.pdf`);
    };

    if (!patient) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    No se encontró información del paciente
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavigationBar title="Historia Clínica del Paciente" />
            <div className="container-fluid mt-4">
                <div className="mb-3 text-end">
                    <button
                        className="btn btn-primary"
                        onClick={exportToPDF}
                    >
                        <Download className="me-2" size={20} />
                        Exportar PDF
                    </button>
                </div>

                <div className="card mb-4">
                    <div className="card-header bg-success text-white">
                        <h5 className="card-title mb-0 text-center">Datos del Paciente</h5>
                    </div>
                    <div className="card-body table-responsive">
                        <table className="table table-bordered table-striped">
                            <tbody>
                                <tr>
                                    <td colSpan="1"><strong>Nombre Completo</strong></td>
                                    <td colSpan="3">{patient.nombre_completo}</td>
                                </tr>
                                <tr>
                                    <td><strong>Fecha de Nacimiento</strong></td>
                                    <td>{patient.fecha_nacimiento}</td>
                                    <td><strong>Género</strong></td>
                                    <td>{patient.genero}</td>
                                </tr>
                                <tr >
                                    <td colSpan="1"><strong>Dirección</strong></td>
                                    <td colSpan="3">{patient.direccion}</td>
                                </tr>
                                <tr>
                                    <td><strong>Teléfono</strong></td>
                                    <td>{patient.telefono}</td>
                                    <td><strong>Email</strong></td>
                                    <td>{patient.email}</td>
                                </tr>
                                <tr>
                                    <td><strong>Contacto de Emergencia</strong></td>
                                    <td>{patient.nombre_emergencia}</td>
                                    <td><strong>Teléfono de Emergencia</strong></td>
                                    <td>{patient.telefono_emergencia}</td>
                                </tr>
                                <tr>
                                    <td><strong>Aseguradora</strong></td>
                                    <td>{patient.compañia_Seguros}</td>
                                    <td><strong>Número de Póliza</strong></td>
                                    <td>{patient.numero_poliza}</td>
                                </tr>
                                <tr>
                                    <td><strong>Vigencia de póliza</strong></td>
                                    <td>{patient.vigencia_poliza}</td>
                                    <td><strong>Estado de Póliza</strong></td>
                                    <td>{patient.estado_poliza}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header bg-success text-white">
                        <h5 className="card-title mb-0 text-center">Motivos de Consulta</h5>
                    </div>

                    <div className="card-body">
                        {listMedicalRecords.length > 0 ? (
                            <ul className="list-unstyled">
                                {listMedicalRecords.map((record) => (
                                    <li key={record.id}>• {record.motivo_consulta}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay motivos de consulta disponibles.</p>
                        )}
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header bg-success text-white">
                        <h5 className="card-title mb-0 text-center">Diagnósticos Previos</h5>
                    </div>

                    <div className="card-body">
                        {listMedicalRecords.length > 0 ? (
                            <ul className="list-unstyled">
                                {listMedicalRecords.map((record) => (
                                    <li key={record.id}>• {record.descripcion_diagnostico}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay diagnósticos disponibles.</p>
                        )}
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header bg-success text-white">
                        <h5 className="card-title mb-0 text-center">Antecedentes Personales</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-success">
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Médico</th>
                                        <th>Diagnóstico</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listMedicalRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                No hay registros médicos disponibles
                                            </td>
                                        </tr>
                                    ) : (
                                        listMedicalRecords.map(record => (
                                            <tr key={record.id}>
                                                <td>{new Date(record.fecha_registro).toLocaleDateString()}</td>
                                                <td>{getMedico(record.medico)}</td>
                                                <td>{record.descripcion_diagnostico}</td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center"> {/* Solo necesitas esto */}
                                                        <button
                                                            className="btn btn-primary me-2"
                                                            onClick={() => handleMedicalRecordPatient(record)}
                                                        >
                                                            <i className="fas fa-info-circle"></i> Ver Detalle
                                                        </button>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={exportToPDF}
                                                        >
                                                            <Download size={20} />
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header bg-success text-white">
                        <h5 className="card-title mb-0 text-center">Detalle del Registro Médico</h5>
                    </div>
                    <div className="card-body">
                        {showListMedicalRecord ? (
                            <ListMedicalRecord medicalRecord={selectedMedicalRecord} /> // Renderiza ListMedicalRecord
                        ) : (
                            <p>Seleccione un registro médico para ver el detalle.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}