import { useEffect, useState } from 'react';
import { getPatients } from '../api/Clinica.api';
import { NavigationBar } from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';
import { FileText, Search } from 'lucide-react';

export function ListMedicalRecordPatients() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function loadPatients() {
            const res = await getPatients();
            setPatients(res.data);
        }
        loadPatients();
    }, []);

    const handleMedicalRecordPatient = (patient) => {
        navigate('/general-medical-records', { state: { patient } });
    };

    const filteredPatients = patients.filter(patient =>
        patient.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <NavigationBar title={"Pacientes"} />
            <div className="container mt-2">
                <div className="row mb-4">
                    <div className="col-md-8">
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
                </div>

                <div className="table-responsive shadow-sm p-3 mb-4 bg-white rounded">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="text-center">
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Correo electrónico</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map(patient => (
                                <tr key={patient.id}>
                                    <td>{patient.nombre_completo}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.telefono}</td>
                                    <td className="text-center">
                                        <button className="btn btn-success btn-sm"
                                            onClick={() => handleMedicalRecordPatient(patient)}>
                                            <FileText />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ListMedicalRecordPatients;