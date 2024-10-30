import { useEffect, useState } from 'react';
import { getPatients, getMedicos, getConsultationType, getRol, addAppointment } from '../api/Clinica.api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserSearch, Stethoscope, Calendar, ClipboardList } from 'lucide-react';
import { NavigationBar } from '../components/NavigationBar';

export function AddAppointment() {
    const [listPatient, setListPatient] = useState([]);
    const [listMedico, setListMedico] = useState([]);
    const [listUsers, setListUsers] = useState([]);
    const [listConsultation, setListConsultation] = useState([]);
    const [listRol, setListRol] = useState([]);
    const [patient, setPatient] = useState('');
    const [searchPatient, setSearchPatient] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [medico, setMedico] = useState('');
    const [consultation, setConsultation] = useState('');
    const [fecha_hora, setFechaHora] = useState('');
    const [estado] = useState('Programada');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [patientsRes, medicosRes, consultationRes, rolRes] = await Promise.all([
                    getPatients(),
                    getMedicos(),
                    getConsultationType(),
                    getRol()
                ]);

                setListPatient(patientsRes.data);
                setListUsers(medicosRes.data);
                setListMedico(medicosRes.data);
                setListConsultation(consultationRes.data);
                setListRol(rolRes.data);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        if (searchPatient.length > 0) {
            const searchTermPatient = searchPatient.toLowerCase();
            const filtered = listPatient.filter(patient =>
                patient.nombre_completo.toLowerCase().includes(searchTermPatient)
            );
            setFilteredPatients(filtered);
            setShowPatientDropdown(true);
        } else {
            setFilteredPatients([]);
            setShowPatientDropdown(false);
        }
    }, [searchPatient, listPatient]);

    const handlePatientSelect = (selectedPatient) => {
        setPatient(selectedPatient.id);
        setSearchPatient(selectedPatient.nombre_completo);
        setShowPatientDropdown(false);
    };

    useEffect(() => {
        if (consultation) {
            const selectedType = listConsultation.find(c => c.id === Number(consultation));
            const rol = listRol.find(r => r.nombre === 'Médico');

            if (selectedType && rol) {
                const medicosFiltrados = listUsers.filter(m => {
                    if (m.rol === rol.id) {
                        if (selectedType.especialidad === null) {
                            return m.especialidad === null;
                        } else {
                            return m.especialidad === selectedType.especialidad;
                        }
                    }
                    return false;
                });
                setListMedico(medicosFiltrados);
            } else {
                setListMedico([]);
            }
        } else {
            setListMedico([]);
        }
    }, [consultation, listUsers, listConsultation, listRol]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newAppoinment = {
            paciente: patient,
            medico: medico,
            fecha_hora: fecha_hora,
            tipo_consulta: consultation,
            estado: estado
        };

        try {
            await addAppointment(newAppoinment);
            setPatient('');
            setSearchPatient('');
            setMedico('');
            setFechaHora('');
            setConsultation('');
            setSuccessMessage('Cita agendada exitosamente!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al agendar cita:', error);
            setSuccessMessage('Error al agendar cita. Inténtalo de nuevo.');
        }
    };

    return (
        <div>
            <NavigationBar title={"Agendar Citas"} />
            <div className="container mt-2">
                <div className="bg-light p-4 rounded shadow">
                    {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
                    <form onSubmit={handleSubmit}>

                        <div className="form-group mb-3">
                            <div className="form-group position-relative">
                                <label htmlFor="fecha_hora" className="form-label fw-bold">
                                    Paciente
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <UserSearch size={20} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="searchPatient"
                                        value={searchPatient}
                                        onChange={(e) => setSearchPatient(e.target.value)}
                                        placeholder="Ingrese nombre del paciente"
                                        required
                                    />
                                </div>

                                {showPatientDropdown && filteredPatients.length > 0 &&
                                    !filteredPatients.some((p) => p.nombre_completo === searchPatient) && (
                                        <div
                                            className="position-absolute w-100 mt-1 shadow bg-white rounded border"
                                            style={{ zIndex: 1000 }}
                                        >
                                            {filteredPatients.map((p) => (
                                                <div
                                                    key={p.id}
                                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handlePatientSelect(p)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {p.nombre_completo}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="consultation" className="form-label fw-bold">
                                Tipo de consulta
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <ClipboardList size={20} />
                                </span>
                                <select
                                    className="form-select"
                                    id="consultation"
                                    value={consultation}
                                    onChange={(e) => setConsultation(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione</option>
                                    {listConsultation.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="medico" className="form-label fw-bold">
                                Médico
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <Stethoscope size={20} />
                                </span>
                                <select
                                    className="form-select"
                                    id="medico"
                                    value={medico}
                                    onChange={(e) => setMedico(e.target.value)}
                                    required
                                    disabled={!consultation}
                                >
                                    <option value="">Seleccione</option>
                                    {listMedico.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {`${m.nombres} ${m.apellidos}`}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="fecha_hora" className="form-label fw-bold">
                                Fecha y hora
                            </label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <Calendar size={20} />
                                </span>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    id="fecha_hora"
                                    value={fecha_hora}
                                    onChange={(e) => setFechaHora(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-end mb-2">
                            <button type="submit" className="btn btn-success btn-lg">
                                Agendar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddAppointment;