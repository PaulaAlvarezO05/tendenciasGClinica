import React, { useState, useEffect } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { getMedicationInventory } from '../api/Clinica.api';

export function AddPrescriptions({ onAddRecord }) {
    const [medication, setMedication] = useState("");
    const [administrationRoute, setAdministrationRoute] = useState("");
    const [dosage, setDosage] = useState("");
    const [frequency, setFrequency] = useState("");
    const [duration, setDuration] = useState(""); 
    const [instructions, setInstructions] = useState("");
    const [listMedication, setListMedication] = useState([]);

    useEffect(() => {
        async function loadMedication() {
            const res = await getMedicationInventory();
            setListMedication(res.data);
        }

        loadMedication();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const [id, medicamento] = medication.split('-');
        const newMedicalRecord = {
            medication_id: id,
            medication_name: medicamento,
            administrationRoute,
            dosage,
            frequency,
            duration,
            instructions,
        };

        onAddRecord(newMedicalRecord);
        setMedication('');
        setAdministrationRoute('');
        setDosage('');
        setFrequency('');
        setDuration('');
        setInstructions('');
    };

    return (
        <Card className="shadow-sm border-light">
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicMedication" className="mb-3">
                        <Form.Label className="fw-bold">Medicamento</Form.Label>
                        <Form.Control
                            as="select"
                            className="form-select"
                            value={medication}
                            onChange={(e) => setMedication(e.target.value)}
                            required
                        >
                            <option disabled value="">Seleccione</option>
                            {listMedication.map((med) => (
                                <option key={med.id} value={`${med.id}-${med.nombre_medicamento}`}>
                                    {med.nombre_medicamento}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
    
                    <Form.Group controlId="formBasicAdministrationRoute" className="mb-3">
                        <Form.Label className="fw-bold">Vía de Administración</Form.Label>
                        <Form.Control
                            as="select"
                            className="form-select"
                            value={administrationRoute}
                            onChange={(e) => setAdministrationRoute(e.target.value)}
                            required
                        >
                            <option disabled value="">Seleccione</option>
                            <option value="Oral">Oral</option>
                            <option value="Intravenosa">Intravenosa</option>
                            <option value="Tópica">Tópica</option>
                            <option value="Inhalada">Inhalada</option>
                        </Form.Control>
                    </Form.Group>
    
                    <Form.Group controlId="formBasicDosage" className="mb-3">
                        <Form.Label className="fw-bold">Dosis</Form.Label>
                        <Form.Control
                            type="text"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            required
                        />
                    </Form.Group>
    
                    <Form.Group controlId="formBasicFrequency" className="mb-3">
                        <Form.Label className="fw-bold">Frecuencia</Form.Label>
                        <Form.Control
                            type="text"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            required
                        />
                    </Form.Group>
    
                    <Form.Group controlId="formBasicDuration" className="mb-3">
                        <Form.Label className="fw-bold">Duración del Tratamiento</Form.Label>
                        <Form.Control
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </Form.Group>
    
                    <Form.Group controlId="formBasicAdditionalInstructions" className="mb-3">
                        <Form.Label className="fw-bold">Instrucciones Adicionales</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        />
                    </Form.Group>
    
                    <div className="text-center">
                        <Button variant="success" type="submit" className="w-100">
                            Agregar
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );    
}
