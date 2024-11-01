import { useState } from 'react';
import { addPatient } from '../api/Clinica.api';
import { NavigationBar } from '../components/NavigationBar';
import 'bootstrap/dist/css/bootstrap.min.css';

export function AddPatient() {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [genero, setGenero] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [nombreEmergencia, setNombreEmergencia] = useState('');
    const [telefonoEmergencia, setTelefonoEmergencia] = useState('');
    const [companiaSeguros, setCompaniaSeguros] = useState('');
    const [numeroPoliza, setNumeroPoliza] = useState('');
    const [vigenciaPoliza, setVigenciaPoliza] = useState('');
    const [estadoPoliza, setEstadoPoliza] = useState('A'); 
    const [ibc, setIbc] = useState(''); 
    const [successMessage, setSuccessMessage] = useState('');

    const handleVigenciaChange = (e) => {
        const nuevaVigencia = e.target.value;
        setVigenciaPoliza(nuevaVigencia);
        
        const estado = new Date(nuevaVigencia) > new Date() ? 'A' : 'I';
        setEstadoPoliza(estado);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPatient = {
            nombre_completo: nombreCompleto,
            fecha_nacimiento: fechaNacimiento,
            genero: genero,
            direccion: direccion,
            telefono: telefono,
            email: email,
            nombre_emergencia: nombreEmergencia,
            telefono_emergencia: telefonoEmergencia,
            compañia_Seguros: companiaSeguros,
            numero_poliza: numeroPoliza,
            estado_poliza: estadoPoliza,
            vigencia_poliza: vigenciaPoliza,
            ibc: ibc,
        };

        try {
            await addPatient(newPatient);
            // Clear form fields
            setNombreCompleto('');
            setFechaNacimiento('');
            setGenero('');
            setDireccion('');
            setTelefono('');
            setEmail('');
            setNombreEmergencia('');
            setTelefonoEmergencia('');
            setCompaniaSeguros('');
            setNumeroPoliza('');
            setVigenciaPoliza('');
            setEstadoPoliza('A'); 
            setIbc('');
            setSuccessMessage('Paciente registrado exitosamente!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al registrar paciente:', error);
            setSuccessMessage('Error al registrar paciente. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="container mt-5">
            <NavigationBar title="Agregar Paciente" />
            <div className="bg-light p-4 rounded shadow mt-4">
                
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="nombreCompleto">Nombres Completos</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombreCompleto"
                                value={nombreCompleto}
                                onChange={(e) => setNombreCompleto(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="mb-3">
                        <label htmlFor="genero">Género</label>
                        <select
                            className="form-control"
                            id="genero"
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                            required
                        >
                            <option value="">Seleccionar género</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="O">Otro</option>
                        </select>
                    </div>
                    <div className="mb-3">
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
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="telefono">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="telefono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
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
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nombreEmergencia">Nombre Contacto de Emergencia</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombreEmergencia"
                            value={nombreEmergencia}
                            onChange={(e) => setNombreEmergencia(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="telefonoEmergencia">Teléfono de Emergencia</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="telefonoEmergencia"
                            value={telefonoEmergencia}
                            onChange={(e) => setTelefonoEmergencia(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="companiaSeguros">Compañía de Seguros</label>
                        <input
                            type="text"
                            className="form-control"
                            id="companiaSeguros"
                            value={companiaSeguros}
                            onChange={(e) => setCompaniaSeguros(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="numeroPoliza">Número de Póliza</label>
                        <input
                            type="number"
                            className="form-control"
                            id="numeroPoliza"
                            value={numeroPoliza}
                            onChange={(e) => setNumeroPoliza(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="vigenciaPoliza">Vigencia de Póliza</label>
                        <input
                            type="date"
                            className="form-control"
                            id="vigenciaPoliza"
                            value={vigenciaPoliza}
                            onChange={handleVigenciaChange} 
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="estadoPoliza">Estado de Póliza</label>
                        <input
                            type="text"
                            className="form-control"
                            id="estadoPoliza"
                            value={estadoPoliza === 'A' ? 'Activa' : 'Inactiva'} 
                            readOnly 
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="ibc">Ingreso Base de Cotización</label>
                            <input
                                type="ibc"
                                className="form-control"
                                id="ibc"
                                value={ibc}
                                onChange={(e) => setIbc(e.target.value)}
                                required
                            />
                        </div>
                        </div>
                  
                    <button type="submit" className="btn btn-primary">Agregar Paciente</button>
                </form>
            </div>
        </div>
    );
}
