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
            SetIbc('');
            setSuccessMessage('Paciente registrado exitosamente!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al registrar paciente:', error);
            setSuccessMessage('Error al registrar paciente. Inténtalo de nuevo.');
        }
    };

    return (
        <div>
            <NavigationBar title="Registrar Paciente" />
            <div className="container mt-4">
                <div className="bg-light p-4 rounded shadow mt-3">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nombreCompleto" className='fw-bold'>Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombreCompleto"
                                value={nombreCompleto}
                                onChange={(e) => setNombreCompleto(e.target.value)}
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="fechaNacimiento" className='fw-bold'>Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="fechaNacimiento"
                                    value={fechaNacimiento}
                                    onChange={(e) => setFechaNacimiento(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="genero" className='fw-bold'>Género</label>
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
                        </div>

                        <div className="mb-3">
                        <label htmlFor="direccion" className='fw-bold'>Dirección</label>
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
                                <label htmlFor="telefono" className='fw-bold'>Teléfono</label>
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
                                <label htmlFor="email" className='fw-bold'>Email</label>
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

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="nombreEmergencia" className='fw-bold'>Nombre Contacto de Emergencia</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombreEmergencia"
                                    value={nombreEmergencia}
                                    onChange={(e) => setNombreEmergencia(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="telefonoEmergencia" className='fw-bold'>Teléfono de Emergencia</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="telefonoEmergencia"
                                    value={telefonoEmergencia}
                                    onChange={(e) => setTelefonoEmergencia(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="companiaSeguros" className='fw-bold'>Compañía de Seguros</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="companiaSeguros"
                                    value={companiaSeguros}
                                    onChange={(e) => setCompaniaSeguros(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="numeroPoliza" className='fw-bold'>Número de Póliza</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="numeroPoliza"
                                    value={numeroPoliza}
                                    onChange={(e) => setNumeroPoliza(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="vigenciaPoliza" className='fw-bold'>Vigencia de Póliza</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="vigenciaPoliza"
                                    value={vigenciaPoliza}
                                    onChange={handleVigenciaChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="estadoPoliza" className='fw-bold'>Estado de Póliza</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="estadoPoliza"
                                    value={estadoPoliza === 'A' ? 'Activa' : 'Inactiva'}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3">
                                <label htmlFor="ibc" className='fw-bold'>Ingreso Base de Cotización</label>
                                <input
                                    type="ibc"
                                    className="form-control"
                                    id="ibc"
                                    value={ibc}
                                    onChange={(e) => setIbc(e.target.value)}
                                    required
                                />
                            </div>
                        </div >
                        <div className="text-end">
                            <button type="submit" className="btn btn-success">Registrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}