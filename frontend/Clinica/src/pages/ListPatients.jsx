import { useEffect, useState } from 'react';
import { getPatients } from '../api/Clinica.api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { NavigationBar } from '../components/NavigationBar';
import { Search, Download } from 'lucide-react';

export function ListPatients() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function loadPatients() {
            const res = await getPatients();
            setPatients(res.data);
        }

        loadPatients();
    }, []);

    const filteredPatients = patients.filter(patient =>
        patient.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToPDF = (patients = filteredPatients) => {
        const doc = new jsPDF('landscape');
        doc.setFontSize(18);
        console.log(patients)
        const title = patients.length === 1 
            ? `Ficha de Paciente: ${patients[0].nombre_completo}`
            : 'Listado de Pacientes';
        doc.text(title, 14, 22);

        const tableColumn = ["Nombre\nCompleto", "Teléfono", "Fecha\nNacimiento", "Dirección", "Género", "Email", "Nombre\nEmergencia", "Teléfono\nEmergencia", "Compañía\nSeguros", "Número\nPóliza", "Vigencia\nPóliza", "Estado\nPóliza"];
        const tableRows = patients.map(patient => [
            patient.nombre_completo,
            patient.telefono,
            new Date(patient.fecha_nacimiento).toLocaleDateString(),
            patient.direccion,
            patient.genero,
            patient.email,
            patient.nombre_emergencia,
            patient.telefono_emergencia,
            patient.compañia_Seguros,
            patient.numero_poliza,
            new Date(patient.vigencia_poliza).toLocaleDateString(),
            patient.estado_poliza
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            headStyles: { fontSize: 7 },
            bodyStyles: { fontSize: 7 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 20 },
                2: { cellWidth: 22 },
                3: { cellWidth: 25 },
                4: { cellWidth: 15 },
                5: { cellWidth: 25 },
                6: { cellWidth: 35 },
                7: { cellWidth: 25 },
                8: { cellWidth: 20 },
                9: { cellWidth: 20 },
                10: { cellWidth: 18 },
                11: { cellWidth: 15 },
            },
            theme: 'striped'
        });
        const fileName = patients.length === 1 
            ? `Paciente_${patients[0].nombre_completo}.pdf`
            : 'Historial_de_Citas_Médicas.pdf';

        doc.save(fileName);
    }


    return (
        <div>
            <NavigationBar title={"Listado de Pacientes"} />
            <div className="container-fluid mt-2">
                <div className="row mb-4">
                    <div className="col-md-8">
                        <div className="input-group">
                            <span className="input-group-text">
                                <Search size={20} />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar paciente por nombre o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100" onClick={() => exportToPDF()}>
                        <Download className="me-2" size={20} />Exportar PDF
                        </button>
                    </div>
                </div>

                <div className="table-responsive shadow-sm p-3 mb-4 bg-white rounded patients-table">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark text-center">
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Teléfono</th>
                                <th>Fecha de Nacimiento</th>
                                <th>Dirección</th>
                                <th>Género</th>
                                <th>Correo Electrónico</th>
                                <th>Contacto Emergencia</th>
                                <th>Teléfono Emergencia</th>
                                <th>Compañía Seguros</th>
                                <th>Número Póliza</th>
                                <th>Vigencia Póliza</th>
                                <th>Estado Póliza</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map(patient => (
                                <tr key={patient.id}>
                                    <td>{patient.nombre_completo}</td>
                                    <td>{patient.telefono}</td>
                                    <td>{new Date(patient.fecha_nacimiento).toLocaleDateString()}</td>
                                    <td>{patient.direccion}</td>
                                    <td className="text-center">{patient.genero}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.nombre_emergencia}</td>
                                    <td>{patient.telefono_emergencia}</td>
                                    <td>{patient.compañia_Seguros}</td>
                                    <td>{patient.numero_poliza}</td>
                                    <td>{new Date(patient.vigencia_poliza).toLocaleDateString()}</td>
                                    <td className="text-center">{patient.estado_poliza}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => exportToPDF([patient])}
                                        >
                                             <Download />
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

export default ListPatients;