import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser, getRol, getMedicalSpecialties } from '../api/Clinica.api';
import { NavigationBar } from '../components/NavigationBar';
import { Trash2, Search, Edit2 } from 'lucide-react';
import { Modal, Button, Form, Card, Table, Alert } from 'react-bootstrap';

export function UpdateUsers() {
    const [users, setUsers] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [listEspecialidades, setListEspecialidades] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        fecha_nacimiento: '',
        direccion: '',
        rol: '',
        especialidad: '',
    });
    const [updateMessage, setUpdateMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        };

        const loadRoles = async () => {
            try {
                const response = await getRol();
                setListRoles(response.data);
            } catch (error) {
                console.error('Error al cargar roles:', error);
            }
        };

        const loadEspecialidades = async () => {
            try {
                const response = await getMedicalSpecialties();
                setListEspecialidades(response.data);
            } catch (error) {
                console.error('Error al cargar especialidades:', error);
            }
        };

        loadUsers();
        loadRoles();
        loadEspecialidades();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoles = (id) => {
        const rol = listRoles.find(r => r.id === id);
        return rol ? rol.nombre : 'Desconocido';
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            nombres: user.nombres,
            apellidos: user.apellidos,
            telefono: user.telefono,
            fecha_nacimiento: user.fecha_nacimiento,
            direccion: user.direccion,
            rol: user.rol,
            especialidad: user.especialidad,
        });
        setUpdateMessage('');
        setShowModal(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await updateUser(selectedUser.id, formData);
            setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
            setUpdateMessage('Usuario actualizado correctamente.');
            setTimeout(() => {
                setShowModal(false);
                setSelectedUser(null);
                setFormData({
                    email: '',
                    nombres: '',
                    apellidos: '',
                    telefono: '',
                    fecha_nacimiento: '',
                    direccion: '',
                    rol: '',
                    especialidad: '',
                });
                setUpdateMessage('');
            }, 1500);
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            setUpdateMessage('Error al actualizar el usuario.');
        }
    };

    return (
        <div>
            <NavigationBar title={"Empleados"} />
            <div className="container mt-4 w-75">
                <div className="row mb-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <Search size={20} />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar empleado por usuario..."
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
                                        <th>Nombre de Usuario</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.username}</td>
                                                <td className='text-center'>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleEditClick(user)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(user.id)}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                No hay usuarios disponibles.
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
                        <Modal.Title as="h4" className="w-100 text-center" >Editar Empleado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Nombres</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombres"
                                            value={formData.nombres}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Apellidos</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="apellidos"
                                            value={formData.apellidos}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Form.Group>
                                </div>
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
                            </div>

                            <div className="row">
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
                                        <Form.Label className="fw-bold">Rol</Form.Label>
                                        <Form.Select
                                            name="rol"
                                            value={formData.rol}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option disabled value="">Seleccione un rol</option>
                                            {listRoles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    {getRoles(formData.rol) === 'Médico' && (
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Especialidad Médica</Form.Label>
                                            <Form.Select
                                                name="especialidad"
                                                value={formData.especialidad}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleccione una especialidad (opcional)</option>
                                                {listEspecialidades.map(especialidad => (
                                                    <option key={especialidad.id} value={especialidad.id}>
                                                        {especialidad.nombre}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    )}
                                </div>
                            </div>

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

export default UpdateUsers;