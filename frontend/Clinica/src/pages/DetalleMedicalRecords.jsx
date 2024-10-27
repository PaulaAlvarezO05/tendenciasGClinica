import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { getPrescripcions, getMedicationInventory } from '../api/Clinica.api';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function DetalleMedicalRecords({ medicalRecord, medico, patient }) {
    const [listPrescripcions, setListPrescripcions] = useState([]);
    const [listMedication, setListMedication] = useState([]);

    const medicalRecord_id = medicalRecord?.id;

    useEffect(() => {
        async function loadData() {
            try {
                const [prescripcionsRes, medicationRes] = await Promise.all([
                    getPrescripcions(),
                    getMedicationInventory()
                ]);

                const filterPrescripcions = prescripcionsRes.data.filter(
                    p => p.historia_clinica === medicalRecord_id
                );
                setListPrescripcions(filterPrescripcions);

                const medicationIds = filterPrescripcions.map(p => p.medicamento);
                const filterMedication = medicationRes.data.filter(
                    m => medicationIds.includes(m.id)
                );

                setListMedication(filterMedication);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }

        if (medicalRecord_id) {
            loadData();
        }
    }, [medicalRecord_id]);

    const getMedication = (id) => {
        const medication = listMedication.find(m => m.id === id);
        return medication ? medication.nombre_medicamento : 'Desconocido';
    };
    
    const exportDetailPDF = () => {
        const doc = new jsPDF();
        let yOffset = 20;

        doc.setFontSize(18);
        doc.text(`Historia Clínica del paciente ${patient.nombre_completo}`, 14, yOffset);

        doc.setFontSize(14);
        yOffset += 10;
        doc.text(`Fecha de Registro: ${new Date(medicalRecord?.fecha_registro).toLocaleString()}`, 14, yOffset);

        yOffset += 5;
        doc.autoTable({
            startY: yOffset,
            head: [['Datos del Paciente']],
            headStyles: { fillColor: [40, 167, 69], halign: 'center' },
            styles: { fillColor: [0, 0, 0] },
        });

        const patientData = [
            ['Nombre Completo', patient?.nombre_completo],
            ['Fecha de Nacimiento', patient?.fecha_nacimiento],
            ['Género', patient?.genero === 'F' ? 'Femenino' : 'Masculino'],
            ['Dirección', patient?.direccion],
            ['Teléfono', patient?.telefono],
            ['Email', patient?.email],
            ['Contacto de Emergencia', patient?.nombre_emergencia],
            ['Teléfono de Emergencia', patient?.telefono_emergencia],
            ['Aseguradora', patient?.compañia_Seguros],
            ['Número de Póliza', patient?.numero_poliza],
            ['Vigencia de Póliza', patient?.vigencia_poliza],
            ['Estado de Póliza', patient?.estado_poliza === 'A' ? 'Activa' : 'Inactiva']
        ];

        yOffset += 7.6;
        doc.autoTable({
            startY: yOffset,
            body: patientData,
            theme: 'grid'
        });

        yOffset = doc.lastAutoTable.finalY + 5;
        doc.autoTable({
            startY: yOffset,
            head: [['Médico']],
            body: [[medico]],
            theme: 'grid',
            headStyles: { fillColor: [40, 167, 69], halign: 'center' }
        });

        yOffset = doc.lastAutoTable.finalY + 5;
        doc.autoTable({
            startY: yOffset,
            head: [['Motivo de Consulta']],
            body: [[medicalRecord.motivo_consulta]],
            theme: 'grid',
            headStyles: { fillColor: [40, 167, 69], halign: 'center' }
        });

        yOffset = doc.lastAutoTable.finalY + 5;
        doc.autoTable({
            startY: yOffset,
            head: [['Diagnóstico']],
            body: [[medicalRecord.descripcion_diagnostico]],
            theme: 'grid',
            headStyles: { fillColor: [40, 167, 69], halign: 'center' }
        });

        yOffset = doc.lastAutoTable.finalY + 5;
        doc.autoTable({
            startY: yOffset,
            head: [['Tratamiento']],
            headStyles: { fillColor: [40, 167, 69], halign: 'center' },
            styles: { fillColor: [0, 0, 0] },
        });
        if (listPrescripcions.length > 0) {
            yOffset += 7.7;

            const prescriptionData = listPrescripcions.map(pres => [
                getMedication(pres.medicamento),
                pres.via_administracion,
                pres.dosis,
                pres.frecuencia,
                pres.duracion,
                pres.instrucciones
            ]);

            doc.autoTable({
                startY: yOffset,
                head: [['Medicamento', 'Vía', 'Dosis', 'Frecuencia', 'Duración', 'Instrucciones']],
                body: prescriptionData,
                theme: 'grid',
                headStyles: { fillColor: [40, 167, 69] }
            });
        }

        doc.save(`historia_clinica_${patient.nombre_completo}_${new Date(medicalRecord.fecha_registro).toLocaleDateString()}.pdf`);
    };
    
    return (
        <form>
            <div className="mb-3">
                <label htmlFor="fechaRegistro" className="form-label"><strong>Fecha de Registro:</strong></label>
                <input
                    type="text"
                    className="form-control"
                    id="fechaRegistro"
                    value={new Date(medicalRecord?.fecha_registro).toLocaleString()}
                    readOnly
                />
            </div>

            <div className="mb-3">
                <label htmlFor="medico" className="form-label"><strong>Médico:</strong></label>
                <input
                    type="text"
                    className="form-control"
                    id="medico"
                    value={medico}
                    readOnly
                />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="motivoConsulta" className="form-label fw-bold">Motivo de consulta:</label>
                <textarea
                    className="form-control"
                    rows="2"
                    value={medicalRecord?.motivo_consulta || ''}
                    readOnly
                />
            </div>

            <div className="form-group mb-3">
                <label htmlFor="descripcionDiagnostico" className="form-label fw-bold">Descripción del diagnóstico</label>
                <textarea
                    className="form-control"
                    rows="2"
                    value={medicalRecord?.descripcion_diagnostico || ''}
                    readOnly
                />
            </div>

            <div className="form-group mb-3">
                <label className="form-label fw-bold">Descripción del tratamiento</label>
                <Table striped bordered hover responsive className="mt-1">
                    <thead>
                        <tr>
                            <th>Medicamento</th>
                            <th>Vía de Administración</th>
                            <th>Dosis</th>
                            <th>Frecuencia</th>
                            <th>Duración</th>
                            <th>Instrucciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listPrescripcions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">No se han agregado prescripciones</td>
                            </tr>
                        ) : (
                            listPrescripcions.map((pres, index) => (
                                <tr key={index}>
                                    <td>{getMedication(pres.medicamento)}</td>
                                    <td>{pres.via_administracion}</td>
                                    <td>{pres.dosis}</td>
                                    <td>{pres.frecuencia}</td>
                                    <td>{pres.duracion}</td>
                                    <td>{pres.instrucciones}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-center mt-3">
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={exportDetailPDF}
                    >
                        <Download size={20} /> Exportar PDF
                    </button>
                </div>
            </div>
        </form>
    );
}

export default DetalleMedicalRecords;
