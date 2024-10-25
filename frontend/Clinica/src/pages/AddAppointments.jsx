import { useEffect, useState } from 'react';
import { getPatients, getMedicos, getConsultationType, getRol, addAppointment} from '../api/Clinica.api';
import 'bootstrap/dist/css/bootstrap.min.css';

export function AddAppointment() {
    const [listPatient, setListPatient] = useState([]);
    const [listMedico, setListMedico] = useState([]);
    const [listUsers, setListUsers] = useState([]);
    const [listConsultation, setListConsultation] = useState([]);
    const [listRol, setListRol] = useState([]);
    const [patient, setPatient] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPatientName, setSelectedPatientName] = useState('');
    const [medico, setMedico] = useState('');
    const [consultation, setConsultation] = useState('');
    const [fecha_hora, setFechaHora] = useState('');
    const [estado] = useState('Programada');
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

        async function loadConsultation() {
            const res = await getConsultationType();
            setListConsultation(res.data);
        }

        async function loadRol() {
            const res = await getRol();
            setListRol(res.data);
        }

        async function loadData() {
            await Promise.all([loadPatients(), loadMedicos(), loadConsultation(), loadRol()]);
        }
        loadData();
    }, []);
    
    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = listPatient.filter(p => 
                p.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPatients(filtered);
            setShowDropdown(true);
        } else {
            setFilteredPatients([]);
            setShowDropdown(false);
        }
    }, [searchTerm, listPatient]);

    const handlePatientSelect = (selectedPatient) => {
        setPatient(selectedPatient.id);
        setSelectedPatientName(selectedPatient.nombre_completo);
        setSearchTerm(selectedPatient.nombre_completo);
        setShowDropdown(false);
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
            setSearchTerm('');
            setSelectedPatientName('');
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
        <div className="container mt-5">
            <h2 className="text-center mb-4">Agendar Cita</h2>
            <div className="bg-light p-4 rounded shadow">
                {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3 position-relative">
                        <label htmlFor="patient-search" className="form-label">Buscar Paciente</label>
                        <input
                            type="text"
                            className="form-control"
                            id="patient-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Escriba el nombre del paciente..."
                            required
                        />
                        {showDropdown && filteredPatients.length > 0 && (
                            <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                {filteredPatients.map((p) => (
                                    <div
                                        key={p.id}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handlePatientSelect(p)}
                                        style={{ cursor: 'pointer' }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                                    >
                                        {p.nombre_completo}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="consultation" className="form-label">Tipo de consulta</label>
                        <select
                            className="form-select"
                            id="consultation"
                            value={consultation}
                            onChange={(e) => setConsultation(e.target.value)}
                            required
                        >
                            <option disabled value="">Seleccione</option>
                            {listConsultation.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="medico" className="form-label">Médico</label>
                        <select
                            className="form-select"
                            id="medico"
                            value={medico}
                            onChange={(e) => setMedico(e.target.value)}
                            required
                            disabled={!consultation}
                        >
                            <option disabled value="">Seleccione</option>
                            {listMedico.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {`${m.nombres} ${m.apellidos}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="fecha_hora" className="form-label">Fecha y hora</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="fecha_hora"
                            value={fecha_hora}
                            onChange={(e) => setFechaHora(e.target.value)}
                            required
                        />
                    </div>
                    <div className="text-end mb-3">
                        <button type="submit" className="btn btn-primary btn-lg">
                            Agendar cita
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}