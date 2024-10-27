import { useEffect, useState } from 'react';
import { addUser, getMedicalSpecialties, getRol } from '../api/Clinica.api'; 
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="container mt-5 bg-light-green p-4 rounded">
            <h2>Agregar Usuario</h2>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="nombres">Nombres</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombres"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="apellidos">Apellidos</label>
                    <input
                        type="text"
                        className="form-control"
                        id="apellidos"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        className="form-control"
                        id="fechaNacimiento"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="direccion">Dirección</label>
                    <input
                        type="text"
                        className="form-control"
                        id="direccion"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="rol">Rol</label>
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
                <div className="form-group mb-3">
                    <label htmlFor="especialidad">Especialidad Médica</label>
                    <select
                        className="form-select"
                        id="especialidad"
                        value={especialidad}
                        onChange={(e) => setEspecialidad(e.target.value)}
                        required
                    >
                        <option disabled value="">Seleccione una especialidad</option>
                        {listEspecialidades.map((especialidad) => (
                            <option key={especialidad.id} value={especialidad.id}>
                                {especialidad.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Agregar Usuario</button>
            </form>
        </div>
    );
}
