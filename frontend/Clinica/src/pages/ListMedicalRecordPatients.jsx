import { useEffect, useState } from 'react';
import { getPatients } from '../api/Clinica.api';
import { NavigationBar } from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';

export function ListMedicalRecordPatients() {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadPatients() {
            const res = await getPatients();
            setPatients(res.data);
        }
        loadPatients();
    }, []);

    const handleMedicalRecordPatient = (patient) => {
        navigate('/medical-record-patient', { state: { patient } });
    };

    return (
        <div>
            <NavigationBar title={"Listado de Pacientes"} />
            <div className="container mt-2">
                <div className="table-responsive shadow-sm p-3 mb-4 bg-white rounded patients-table">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark text-center">
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Correo electrónico</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(patient => (
                                <tr key={patient.id}>
                                    <td>{patient.nombre_completo}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.telefono}</td>
                                    <td className="text-center">
                                        <button className="btn btn-info btn-sm"
                                            onClick={() => handleMedicalRecordPatient(patient)}>
                                                Ver Historia Clínica
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
