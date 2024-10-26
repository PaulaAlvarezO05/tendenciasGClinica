import { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { getPatients, addMedicalRecord, addPrescription, updateAppointment, getAppointment } from '../api/Clinica.api';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationBar } from '../components/NavigationBar';

export function ListMedicalRecords(selectedMedicalRecord) { 
    const [prescripcion, setPrescripcion] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [listPatient, setListPatient] = useState([]);
    const [diagnosis, setDiagnosis] = useState('');

    useEffect(() => {
        async function loadPatients() {
            const res = await getPatients();
            setListPatient(res.data);
        }

        loadPatients()
    }, []);

    const getPatient = (id) => {
        const patient = listPatient.find(p => p.id === id);
        return patient ? patient.nombre_completo : 'Desconocido';
    };

    console.log(selectedMedicalRecord)
    console.log(selectedMedicalRecord.medicalRecord.id)
    return (
                <form>
                    <div className="form-group mb-3">
                    <label htmlFor="diagnosis" className="form-label fw-bold">Motivo de consulta</label>
                        <textarea
                            type="text"
                            className="form-control"
                            rows="4"
                            value={selectedMedicalRecord.medicalRecord.motivo_consulta}
                            disabled
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="diagnosis" className="form-label fw-bold">Descripción del diagnóstico</label>
                        <textarea
                            type="text"
                            className="form-control"
                            rows="4"
                            value={selectedMedicalRecord.medicalRecord.descripcion_diagnostico}
                            disabled
                        />
                    </div>

                    <div className="form-group mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <label className="form-label fw-bold">Descripción del tratamiento</label>
                        </div>

                        <Table striped bordered hover className="mt-3">
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
                                {prescripcion.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">No se han agregado prescripciones</td>
                                    </tr>
                                ) : (
                                    prescripcion.map((pres, index) => (
                                        <tr key={index}>
                                            <td>{pres.medication_name}</td>
                                            <td>{pres.administrationRoute}</td>
                                            <td>{pres.dosage}</td>
                                            <td>{pres.frequency}</td>
                                            <td>{pres.duration}</td>
                                            <td>{pres.instructions}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </form>
    );
}

export default ListMedicalRecords;