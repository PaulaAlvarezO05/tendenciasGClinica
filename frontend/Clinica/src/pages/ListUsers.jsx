import { useEffect, useState } from 'react';
import { getUsers, getRol, getMedicalSpecialties } from '../api/Clinica.api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { NavigationBar } from '../components/NavigationBar';
import { Search, Download } from 'lucide-react';

export function ListUsers() {
    const [users, setUsers] = useState([]);
    const [listRol, setListRol] = useState([]);
    const [listSpecialty, setListSpecialty] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRol, setSelectedRol] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');

    useEffect(() => {
        async function loadData() {
            try {
                const [userRes, rolRes, specialtyRes] = await Promise.all([
                    getUsers(),
                    getRol(),
                    getMedicalSpecialties(),
                ]);
                setUsers(userRes.data);
                setListRol(rolRes.data);
                setListSpecialty(specialtyRes.data);
                setFilteredUsers(userRes.data);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        }
        loadData();
    }, []);
    
    useEffect(() => {
        filterUsers();
    }, [searchTerm, selectedRol, selectedSpecialty, users]);

    const filterUsers = () => {
        let filtered = [...users];
        
        if (searchTerm) {
            filtered = filtered.filter(user => 
                `${user.nombres} ${user.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedRol) {
            filtered = filtered.filter(user => user.rol === Number(selectedRol));
        }
        
        const medicoRol = listRol.find(r => r.nombre === 'Médico');
        
        if (medicoRol && selectedSpecialty) {
            filtered = filtered.filter(user => user.rol === medicoRol.id && user.especialidad === Number(selectedSpecialty));
        }

        setFilteredUsers(filtered);
    };

    const getRoles = (id) => {
        const rol = listRol.find(r => r.id === id);
        return rol ? rol.nombre : 'Desconocido';
    };

    const getSpeciality = (id) => {
        if (!id) return '-';
        const specialty = listSpecialty.find(s => s.id === id);
        return specialty ? specialty.nombre : '-';
    };

    const exportToPDF = (userData = filteredUsers) => {
        const doc = new jsPDF();
        const title = userData.length === 1 
            ? `Ficha de Usuario: ${userData[0].nombres} ${userData[0].apellidos}`
            : 'Listado de Usuarios';
        doc.setFontSize(18);
        doc.text(title, 14, 22);

        const tableColumn = ["Nombre", "Apellidos", "Dirección", "Rol", "Email", "Teléfono", "Especialidad"];
        const tableRows = userData.map(user => [
            user.nombres,
            user.apellidos,
            user.direccion,
            getRoles(user.rol),
            user.email,
            user.telefono,
            getSpeciality(user.especialidad),
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            headStyles: { fontSize: 7 },
            bodyStyles: { fontSize: 7 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 25 },
                2: { cellWidth: 25 },
                3: { cellWidth: 25 },
                4: { cellWidth: 25 },
                5: { cellWidth: 20 },
                6: { cellWidth: 25 },
            },
            theme: 'striped'
        });

        const fileName = userData.length === 1 
            ? `Usuario_${userData[0].nombres}_${userData[0].apellidos}.pdf`
            : 'Listado_de_Usuarios.pdf';

        doc.save(fileName);
    };

    return (
        <div>
            <NavigationBar title={"Listado de Empleados"} />
            <div className="container-fluid mt-4">
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text">
                                <Search size={20} />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por nombre o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <select 
                            className="form-select"
                            value={selectedRol}
                            onChange={(e) => {
                                setSelectedRol(e.target.value);
                                setSelectedSpecialty('');
                            }}
                        >
                            <option value="">Todos los roles</option>
                            {listRol.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    {getRoles(Number(selectedRol)) === 'Médico' && (
                        <div className="col-md-3">
                            <select 
                                className="form-select"
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                            >
                                <option value="">Todas las especialidades</option>
                                {listSpecialty.map(specialty => (
                                    <option key={specialty.id} value={specialty.id}>
                                        {specialty.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100" onClick={() => exportToPDF()}>
                            <Download className="me-2" size={20} />Exportar PDF
                        </button>
                    </div>
                </div>

                <div className="table-responsive shadow-sm p-3 mb-5 bg-white rounded">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark text-center">
                            <tr>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                                <th>Dirección</th>
                                <th>Rol</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Especialidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.nombres}</td>
                                    <td>{user.apellidos}</td>
                                    <td>{user.direccion}</td>
                                    <td>{getRoles(user.rol)}</td>
                                    <td>{user.email}</td>
                                    <td>{user.telefono}</td>
                                    <td>{getSpeciality(user.especialidad)}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => exportToPDF([user])}
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

export default ListUsers;