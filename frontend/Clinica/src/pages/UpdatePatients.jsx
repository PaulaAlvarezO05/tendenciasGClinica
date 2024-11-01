import React, { useEffect, useState } from 'react';
import { getPatients, updatePatient, deletePatient } from '../api/Clinica.api';
import { NavigationBar } from '../components/NavigationBar';
import { Trash2, Search, Edit2 } from 'lucide-react';
import { Modal, Button, Form, Card, Table, Alert } from 'react-bootstrap';

export function UpdatePatients() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        fecha_nacimiento: '',
        genero: '',
        direccion: '',
        telefono: '',
        email: '',
        nombre_emergencia: '',
        telefono_emergencia: '',
        compañia_Seguros: '',
        numero_poliza: '',
        estado_poliza: 'A',
        vigencia_poliza: '',
        ibc: '',
    });
    const [updateMessage, setUpdateMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadPatients = async () => {
            try {
                const response = await getPatients();
                setPatients(response.data);
            } catch (error) {
                console.error('Error al cargar pacientes:', error);
            }
        };

        loadPatients();
    }, []);

    const filteredPatients = patients.filter(patient =>
        patient.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (patient) => {
        setSelectedPatient(patient);
        setFormData({
            nombre_completo: patient.nombre_completo,
            fecha_nacimiento: patient.fecha_nacimiento,
            genero: patient.genero,
            direccion: patient.direccion,
            telefono: patient.telefono,
            email: patient.email,
            nombre_emergencia: patient.nombre_emergencia,
            telefono_emergencia: patient.telefono_emergencia,
            compañia_Seguros: patient.compañia_Seguros,
            numero_poliza: patient.numero_poliza,
            estado_poliza: patient.estado_poliza,
            vigencia_poliza: patient.vigencia_poliza,
            ibc: patient.ibc,
        });
        setUpdateMessage('');
        setShowModal(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await deletePatient(id);
            setPatients(patients.filter(patient => patient.id !== id));
        } catch (error) {
            console.error('Error al eliminar el paciente:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };

        if (name === 'vigencia_poliza') {
            const today = new Date();
            const vigenciaDate = new Date(value);
            updatedFormData.estado_poliza = vigenciaDate > today ? 'A' : 'I';
        }

        setFormData(updatedFormData);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedPatient = await updatePatient(selectedPatient.id, formData);
            setPatients(patients.map(patient => (patient.id === updatedPatient.id ? updatedPatient : patient)));
            setUpdateMessage('Paciente actualizado correctamente.');
            setTimeout(() => {
                setShowModal(false);
                setSelectedPatient(null);
                setFormData({
                    nombre_completo: '',
                    fecha_nacimiento: '',
                    genero: '',
                    direccion: '',
                    telefono: '',
                    email: '',
                    nombre_emergencia: '',
                    telefono_emergencia: '',
                    compañia_Seguros: '',
                    numero_poliza: '',
                    estado_poliza: 'A',
                    vigencia_poliza: '',
                    ibc: '',
                });
                setUpdateMessage('');
            }, 1500);
        } catch (error) {
            console.error('Error al actualizar el paciente:', error);
            setUpdateMessage('Error al actualizar el paciente.');
        }
    };

    return (
        <div>
            <NavigationBar title={"Actualizar Pacientes"} />
            <div className="container mt-4 w-75">
                <div className="row mb-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <Search size={20} />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar paciente por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card className="shadow-sm border-light mb-4">
                    <Card.Body>
                        <div className="table-responsive">
                            <Table hover bordered striped>
                                <thead className="table-light text-center">
                                    <tr>
                                        <th>Nombre Completo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.length > 0 ? (
                                        filteredPatients.map(patient => (
                                            <tr key={patient.id}>
                                                <td>{patient.nombre_completo}</td>
                                                <td className='text-center'>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleEditClick(patient)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(patient.id)}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">
                                                No hay pacientes disponibles.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>

                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    size="lg"
                    centered
                >
                    <Modal.Header className="bg-success text-white border-bottom">
                        <Modal.Title as="h4" className="w-100 text-center">Editar Paciente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Nombre Completo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombre_completo"
                                            value={formData.nombre_completo}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Fecha de Nacimiento</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="fecha_nacimiento"
                                            value={formData.fecha_nacimiento}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Género</Form.Label>
                                        <Form.Select
                                            name="genero"
                                            value={formData.genero}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="masculino">Masculino</option>
                                            <option value="femenino">Femenino</option>
                                            <option value="otro">Otro</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Dirección</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Correo Electrónico</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Contacto de Emergencia</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombre_emergencia"
                                            value={formData.nombre_emergencia}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Teléfono de Emergencia</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telefono_emergencia"
                                            value={formData.telefono_emergencia}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Compañía de Seguros</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="compañia_Seguros"
                                            value={formData.compañia_Seguros}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Número de Póliza</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="numero_poliza"
                                            value={formData.numero_poliza}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Vigencia de Póliza</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="vigencia_poliza"
                                            value={formData.vigencia_poliza}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Estado de Póliza</Form.Label>
                                        <Form.Select
                                            name="estado_poliza"
                                            value={formData.estado_poliza}
                                            disabled
                                        >
                                            <option value="A">Activa</option>
                                            <option value="I">Inactiva</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Ingreso Base de Cotización</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ibc"
                                    value={formData.ibc}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            {updateMessage && (
                                <Alert variant={updateMessage.includes('error') ? 'danger' : 'success'}>
                                    {updateMessage}
                                </Alert>
                            )}

                            <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="success"
                                    type="submit"
                                >
                                    Actualizar
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default UpdatePatients;