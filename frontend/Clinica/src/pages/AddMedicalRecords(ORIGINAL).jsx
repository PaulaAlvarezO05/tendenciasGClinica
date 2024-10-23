import { useState, useEffect } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import { getPatients, getMedicos, getRol, addMedicalRecord, addPrescription } from '../api/Clinica.api';
import { AddPrescriptions } from "./AddPrescriptions";

export function AddMedicalRecords() {
    const [prescripcion, setPrescripcion] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [listPatient, setListPatient] = useState([]);
    const [listUsers, setListUsers] = useState([]);
    const [listMedico, setListMedico] = useState([]);
    const [listRol, setListRol] = useState([]);
    const [patient, setPatient] = useState('');
    const [medico, setMedico] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        async function loadPatients() {
            const res = await getPatients();
            setListPatient(res.data);
        }

        async function loadMedicos() {
            const res = await getMedicos();
            setListUsers(res.data);
            setListMedico(res.data);
        }

        async function loadRol() {
            const res = await getRol();
            setListRol(res.data);
        }

        async function loadData() {
            await Promise.all([loadPatients(), loadMedicos(), loadRol()]);
        }
        loadData();
    }, []);

    useEffect(() => {
        if (listRol.length > 0 && listUsers.length > 0) {
            const rol = listRol.find(r => r.nombre === 'Médico');
            if (rol) {
                const medicosFiltrados = listUsers.filter(m => m.rol === rol.id);
                setListMedico(medicosFiltrados);
            }
        }
    }, [listRol, listUsers]);

    const handleAddRecord = (newPrescription) => {
        setPrescripcion([...prescripcion, newPrescription]);
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newMedicalRecord = {
            paciente: patient,
            medico: medico,
            fecha_registro: new Date().toISOString(),
            descripcion_diagnostico: diagnosis
        };

        try {
            const res = await addMedicalRecord(newMedicalRecord);
            const medicalRecordId = res.id;

            for (let prescription of prescripcion) {
                const newPrescription = {
                    medicamento: prescription.medication_id,
                    via_administracion: prescription.administrationRoute,
                    dosis: prescription.dosage,
                    frecuencia: prescription.frequency,
                    duracion: prescription.duration,
                    instrucciones: prescription.instructions,
                    historia_clinica: medicalRecordId
                };
                await addPrescription(newPrescription);
            }

            setPatient('');
            setMedico('');
            setDiagnosis('');
            setPrescripcion([]);
            setSuccessMessage('Historia clínica registrada exitosamente!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al registrar la historia clínica o las prescripciones:', error);
            setSuccessMessage('Error al registrar. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Registro de Historias Clínicas</h2>
            <div className="bg-white p-4 rounded shadow-sm">
                {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
                <form>
                    <div className="form-group mb-3">
                        <label htmlFor="patient" className="form-label fw-bold">Paciente</label>
                        <select
                            className="form-select"
                            id="patient"
                            value={patient}
                            onChange={(e) => setPatient(e.target.value)}
                            required
                        >
                            <option disabled value="">Seleccione un paciente</option>
                            {listPatient.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre_completo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="medico" className="form-label fw-bold">Médico</label>
                        <select
                            className="form-select"
                            id="medico"
                            value={medico}
                            onChange={(e) => setMedico(e.target.value)}
                            required
                        >
                            <option disabled value="">Seleccione un médico</option>
                            {listMedico.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {`${m.nombres} ${m.apellidos}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="diagnosis" className="form-label fw-bold">Descripción del diagnóstico</label>
                        <textarea
                            id="diagnosis"
                            className="form-control"
                            rows="4"
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <label className="form-label fw-bold">Descripción del tratamiento</label>
                            <Button variant="primary" onClick={() => setShowModal(true)}>
                                Agregar Medicamentos
                            </Button>
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

                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton className="bg-success text-white border-bottom">
                                <Modal.Title as="h4" className="w-100 text-center" >Medicamentos</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <AddPrescriptions onAddRecord={handleAddRecord} />
                            </Modal.Body>
                        </Modal>
                    </div>

                    <div className="text-end mb-3">
                        <Button type="submit" className="btn btn-success btn-lg" onClick={handleSubmit}>
                            Registrar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
