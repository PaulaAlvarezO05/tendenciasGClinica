import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser, getRol, getMedicalSpecialties } from '../api/Clinica.api';
import { NavigationBar } from '../components/NavigationBar';
import { Trash2, Search } from 'lucide-react';

export function UpdateUsers() {
    const [users, setUsers] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [listEspecialidades, setListEspecialidades] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
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

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsEditing(true);
        setFormData({
            email: user.email,
            nombres: user.nombres,
            apellidos: user.apellidos,
            telefono: user.telefono,
            fecha_nacimiento: user.fecha_nacimiento,
            direccion: user.direccion,
            rol: user.rol ? user.rol.id : '',
            especialidad: user.especialidad ? user.especialidad.id : '', 
        });
        setUpdateMessage('');
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
            setIsEditing(false);
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
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            setUpdateMessage('Error al actualizar el usuario.');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
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
    };

    return (
        <div className="container mt-4">
            <NavigationBar title={"Actualizar Empleado"} />
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">
                            <Search size={20} />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar usuario por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="table-responsive shadow-sm p-3 mb-5 bg-white rounded" id="users-table">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre de Usuario</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>
                                        <button 
                                            className="btn btn-outline-success btn-sm me-2"
                                            onClick={() => handleEditClick(user)}>
                                            <span>Actualizar</span>
                                        </button>
                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDeleteClick(user.id)}>
                                            <Trash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No hay usuarios disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isEditing && (
                <div className="mt-4">
                    <h3>Editar Usuario</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombres</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="nombres" 
                                    value={formData.nombres} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Apellidos</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="apellidos" 
                                value={formData.apellidos} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="telefono" 
                                value={formData.telefono} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Fecha de Nacimiento</label>
                            <input 
                                type="date" 
                                className="form-control" 
                                name="fecha_nacimiento" 
                                value={formData.fecha_nacimiento} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Dirección</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="direccion" 
                                value={formData.direccion} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="rol">Rol</label>
                            <select
                                className="form-select"
                                id="rol"
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
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="especialidad">Especialidad Médica</label>
                            <select
                                className="form-select"
                                id="especialidad"
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
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary">Actualizar Usuario</button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={handleCancelEdit}>Cancelar</button>
                    </form>
                    {updateMessage && <div className="alert alert-info mt-3">{updateMessage}</div>}
                </div>
            )}
        </div>
    );
}

export default UpdateUsers;
