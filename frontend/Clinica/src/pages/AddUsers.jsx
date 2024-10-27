import { useEffect, useState } from 'react';
import { addUser, getMedicalSpecialties, getRol } from '../api/Clinica.api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavigationBar } from '../components/NavigationBar';

export function AddUser() {
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [rol, setRol] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 

    const [listEspecialidades, setListEspecialidades] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadEspecialidades = async () => {
            try {
                const res = await getMedicalSpecialties();
                setListEspecialidades(res.data);
            } catch (error) {
                console.error('Error al cargar especialidades médicas:', error);
            }
        };

        loadEspecialidades();
    }, []);

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const res = await getRol();
                setListRoles(res.data);
            } catch (error) {
                console.error('Error al cargar roles:', error);
            }
        };

        loadRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            username,
            email,
            password,
            nombres,
            apellidos,
            telefono,
            fecha_nacimiento: fechaNacimiento,
            direccion,
            rol,
            especialidad,
        };

        try {
            await addUser(newUser);
            setUsername('');
            setEmail('');
            setPassword('');
            setNombres('');
            setApellidos('');
            setTelefono('');
            setFechaNacimiento('');
            setDireccion('');
            setRol('');
            setEspecialidad('');
            setSuccessMessage('Usuario registrado exitosamente!');

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            setSuccessMessage('Error al registrar usuario. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="container mt-4">
            <NavigationBar title="Agregar Empleado" />
            <div className="bg-light p-4 rounded shadow-sm">
              
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="username" className="form-label">Nombre de Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="nombres" className="form-label">Nombres</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombres"
                                value={nombres}
                                onChange={(e) => setNombres(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="apellidos" className="form-label">Apellidos</label>
                            <input
                                type="text"
                                className="form-control"
                                id="apellidos"
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="telefono" className="form-label">Teléfono</label>
                            <input
                                type="text"
                                className="form-control"
                                id="telefono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                id="fechaNacimiento"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="direccion" className="form-label">Dirección</label>
                            <input
                                type="text"
                                className="form-control"
                                id="direccion"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="rol" className="form-label">Rol</label>
                            <select
                                className="form-select"
                                id="rol"
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                                required
                            >
                                <option disabled value="">Seleccione un rol</option>
                                {listRoles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="especialidad" className="form-label">Especialidad Médica</label>
                            <select
                                className="form-select"
                                id="especialidad"
                                value={especialidad}
                                onChange={(e) => setEspecialidad(e.target.value)}
                                
                            >
                                <option disabled value="">Seleccione una especialidad</option>
                                {listEspecialidades.map((especialidad) => (
                                    <option key={especialidad.id} value={especialidad.id}>
                                        {especialidad.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Agregar Usuario</button>
                </form>
            </div>
        </div>
    );
}

export default AddUser;