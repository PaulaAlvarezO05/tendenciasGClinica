import { useEffect, useState } from 'react';
import { getMedicos, getMedicalRecords } from '../api/Clinica.api';
import { NavigationBar } from '../components/NavigationBar';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download } from 'lucide-react';
import DetalleMedicalRecords from './DetalleMedicalRecords';
import { Modal } from 'react-bootstrap';

export function GeneralMedicalRecords() {
    const location = useLocation();
    const { patient } = location.state || {};
    const [listMedicalRecords, setListMedicalRecords] = useState([]);
    const [listMedicos, setListMedicos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState(null);

    const patient_id = patient?.id;

    useEffect(() => {
        async function loadData() {
            const [medicalRecordsRes, medicosRes] = await Promise.all([
                getMedicalRecords(),
                getMedicos()
            ]);

            const filteredRecords = medicalRecordsRes.data.filter(
                record => record.paciente === patient_id
            );
            setListMedicalRecords(filteredRecords);
            setListMedicos(medicosRes.data);

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
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMedicalRecord(null);
    };

    const exportGeneralPDF = () => {
        const doc = new jsPDF();
        let yOffset = 20;

        doc.setFontSize(18);
        doc.text(`Resumen de la Historia Clínica del paciente ${patient.nombre_completo}`, 14, yOffset);

        yOffset += 10;
        doc.setFontSize(14);
        doc.autoTable({
            startY: yOffset,
            head: [['Datos del Paciente']],
            headStyles: { fillColor: [40, 167, 69], halign: 'center' },
            didParseCell: function (data) {
                data.cell.styles.colSpan = 2;
            },
            styles: { fillColor: [0, 0, 0] },
        });

        const patientData = [
            ['Nombre Completo', patient.nombre_completo],
            ['Fecha de Nacimiento', patient.fecha_nacimiento],
            ['Género', patient.genero === 'F' ? 'Femenino' : patient.genero === 'M' ? 'Masculino' : 'No especificado'],
            ['Dirección', patient.direccion],
            ['Teléfono', patient.telefono],
            ['Email', patient.email],
            ['Contacto de Emergencia', patient.nombre_emergencia],
            ['Teléfono de Emergencia', patient.telefono_emergencia],
            ['Aseguradora', patient.compañia_Seguros],
            ['Número de Póliza', patient.numero_poliza],
            ['Vigencia de póliza', patient.vigencia_poliza],
            ['Estado de Póliza', patient.estado_poliza === 'A' ? 'Activa' : 'Inactiva']
        ];

        yOffset += 7.6;
        doc.autoTable({
            startY: yOffset,
            body: patientData,
            theme: 'grid'
        });

        yOffset = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.autoTable({
            startY: yOffset,
            head: [['Motivos de Consulta']],
            headStyles: { fillColor: [40, 167, 69], halign: 'center' },
            didParseCell: function (data) {
                data.cell.styles.colSpan = 2;
            }
        });

        const consultaData = listMedicalRecords.map(record => [
            `• ${record.motivo_consulta}`
        ]);

        yOffset += 7.6;

        doc.autoTable({
            startY: yOffset,
            body: consultaData,
            theme: 'plain'
        });

        yOffset = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.autoTable({
            startY: yOffset,
            head: [['Diagnosticos Previos']],
            headStyles: { fillColor: [40, 167, 69], halign: 'center' },
            didParseCell: function (data) {
                data.cell.styles.colSpan = 2;
            }
        });

        const consultaData1 = listMedicalRecords.map(record => [
            `• ${record.descripcion_diagnostico}`
        ]);

        yOffset += 7.6;

        doc.autoTable({
            startY: yOffset,
            body: consultaData1,
            theme: 'plain'
        });

        yOffset = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.autoTable({
            startY: yOffset,
            head: [['Antecedentes Personales']],
            headStyles: { fillColor: [40, 167, 69], halign: 'center' },
            didParseCell: function (data) {
                data.cell.styles.colSpan = 2;
            }
        });

        const antecedentesData = listMedicalRecords.map(record => [
            new Date(record.fecha_registro).toLocaleDateString(),
            getMedico(record.medico, listMedicos),
            record.descripcion_diagnostico
        ]);

        doc.autoTable({
            startY: yOffset,
            head: [['Fecha', 'Médico', 'Diagnóstico']],
            body: antecedentesData,
            theme: 'grid',
            headStyles: { fillColor: [40, 167, 69] }
        });

        doc.save(`resumen_historia_clinica_${patient.nombre_completo}.pdf`);
    };

    return (
        <div>
            <NavigationBar title="Historia Clínica del Paciente" />
            <div className="container-fluid mt-2">
                <div className="mb-3 text-end">
                    <button
                        className="btn btn-primary"
                        onClick={exportGeneralPDF}
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
                                    <td>
                                        {patient.genero === 'F' ? 'Femenino' : patient.genero === 'M' ? 'Masculino' : 'No especificado'}
                                    </td>
                                </tr>
                                <tr>
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
                                    <td>
                                        {patient.estado_poliza === 'A' ? 'Activa' : 'Inactiva'}
                                    </td>
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
                                                    <div className="d-flex justify-content-center">
                                                        <button
                                                            className="btn btn-success me-2"
                                                            onClick={() => handleMedicalRecordPatient(record)}
                                                        >
                                                            <i className="fas fa-info-circle"></i> Ver Detalle
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

                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton className="bg-success text-white">
                        <Modal.Title>Detalle del Registro Médico</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedMedicalRecord && (
                            <div>
                                <DetalleMedicalRecords medicalRecord={selectedMedicalRecord} medico={getMedico(selectedMedicalRecord.medico)} patient={patient} />
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}