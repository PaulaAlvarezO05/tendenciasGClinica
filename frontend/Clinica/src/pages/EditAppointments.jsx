import React, { useEffect, useState } from 'react';
import { getPatients, getAppointments, updateAppointment, getMedicos, getConsultationType, addBilling} from '../api/Clinica.api';
import { NavigationBar } from '../components/NavigationBar';
import { UserSearch, CalendarClock, CalendarX, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function EditAppointments() {
    const [patients, setPatients] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [medicos, setMedicos] = useState([]);
    const [consultation, setConsultation] = useState([]);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newDateTime, setNewDateTime] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        method: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        amount: '',
    });
    useEffect(() => {
        async function loadData() {
            try {
                const [appointmentsRes, patientsRes, medicosRes, consultationRes] = await Promise.all([
                    getAppointments(),
                    getPatients(),
                    getMedicos(),
                    getConsultationType(),
                   
                ]);

                setAllAppointments(appointmentsRes.data);
                setPatients(patientsRes.data);
                setMedicos(medicosRes.data);
                setConsultation(consultationRes.data);
              
                filterAppointments(appointmentsRes.data, '');
            } catch (error) {
                console.error('Error loading data:', error);
                setUpdateMessage('Error al cargar los datos. Por favor, recarga la página.');
            }
        }
        loadData();
    }, []);

    const filterAppointments = (appointments, search) => {
        if (!search) {
            setAppointments(appointments.filter(app => app.estado === 'Programada'));
            return;
        }

        const searchLower = search.toLowerCase();
        const filtered = appointments.filter(appointment => {
            const patient = patients.find(p => p.id === appointment.paciente);
            const patientName = patient ? patient.nombre_completo.toLowerCase() : '';
            return patientName.includes(searchLower) && appointment.estado === 'Programada';
        });
        setAppointments(filtered);
    };

    useEffect(() => {
        filterAppointments(allAppointments, searchTerm);
    }, [searchTerm, allAppointments, patients]);

    const getPatient = (id) => {
        const patient = patients.find(p => p.id === id); 
        if (patient) {
            return {
                nombre: patient.nombre_completo, 
                ibc: parseFloat(patient.ibc) || 0, 
            };
        }
        return {
            nombre: 'Desconocido',
            ibc: 0,
        };
    };
    
  
    const getMedico = (id) => {
        const medico = medicos.find(d => d.id === id);
        return medico ? `${medico.nombres} ${medico.apellidos}` : 'Desconocido';
    };

    const getConsultation = (id) => {
        const consult = consultation.find(c => c.id === id);
        if (consult) {
            return {
                nombre: consult.nombre,
                precio_base: parseFloat(consult.precio_base) || 0, 
            };
        }
        return {
            nombre: 'Desconocido',
            precio_base: 0,
        };
    };
    
    
    const handlePayment = (appointment) => {
        const patie = getPatient(appointment.paciente);
        console.log('Paciente:', patie); // Verifica el nombre del paciente
        if (!patie.nombre) {
            console.error(`Paciente con ID ${appointment.paciente} no encontrado.`);
        }
        const consulta = getConsultation(appointment.tipo_consulta);
        const paymentAmount = calculatePayment(patie.ibc, consulta.precio_base).toFixed(2);
        setSelectedAppointment(appointment);
        setPaymentInfo({
            ...paymentInfo,
            amount: paymentAmount || '0' 
        });
        setShowPaymentModal(true);
    };


    const [isProcessing, setIsProcessing] = useState(false);

    const handlePaymentSubmit = async () => {
        if (isProcessing) return; // Evita múltiples clics
        setIsProcessing(true);

        try {
            
            const updatedAppointment = {
                ...selectedAppointment,
                estado_pago: 'Pagado',
                metodo_pago: paymentInfo.method,
                fecha_pago: new Date().toISOString(),
            };

            await updateAppointment(selectedAppointment.id, updatedAppointment);

            // Crear la factura
            const patie = getPatient(selectedAppointment.paciente);
            const consulta = getConsultation(selectedAppointment.tipo_consulta);
            const billingData = {
                paciente: selectedAppointment.paciente,
                fecha: new Date().toISOString().slice(0, 10),
                monto: calculatePayment(patie.ibc, consulta.precio_base),
                detalles: consulta.nombre,
                estado_pago: 'Pagado',
            };

            await addBilling(billingData);

            // Mensaje de éxito
            setUpdateMessage('¡Pago procesado y factura creada exitosamente!');

            // Actualizar citas
            const updatedAllAppointments = allAppointments.map(app =>
                app.id === selectedAppointment.id ? updatedAppointment : app
            );
            setAllAppointments(updatedAllAppointments);
            filterAppointments(updatedAllAppointments, searchTerm);

            setShowPaymentModal(false);
            setPaymentInfo({
                method: '',
                cardNumber: '',
                expiryDate: '',
                cvv: '',
                amount: '',
            });
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            setUpdateMessage('Error al procesar el pago. Inténtalo de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    
    const handleCancelAppointment = async (id) => {
        try {
            const appointmentToUpdate = allAppointments.find(appointment => appointment.id === id);
            const updatedAppointment = {
                ...appointmentToUpdate,
                estado: 'Cancelada'
            };

            await updateAppointment(id, updatedAppointment);
            setUpdateMessage('Cita cancelada exitosamente!');
            setTimeout(() => setUpdateMessage(''), 3000);

            const updatedAllAppointments = allAppointments.filter(appointment => appointment.id !== id);
            setAllAppointments(updatedAllAppointments);
            filterAppointments(updatedAllAppointments, searchTerm);
        } catch (error) {
            console.error('Error al cancelar la cita:', error);
            setUpdateMessage('Error al cancelar la cita. Inténtalo de nuevo.');
        }
    };

    const handleReschedule = (appointment) => {
        setSelectedAppointment(appointment);
        setNewDateTime(appointment.fecha_hora.slice(0, 16));
        setShowRescheduleModal(true);
    };

    const handleRescheduleSubmit = async () => {
        try {
            const updatedAppointment = {
                ...selectedAppointment,
                fecha_hora: newDateTime
            };

            await updateAppointment(selectedAppointment.id, updatedAppointment);
            setUpdateMessage('Cita reprogramada exitosamente!');

            const updatedAllAppointments = allAppointments.map(app =>
                app.id === selectedAppointment.id ? updatedAppointment : app
            );
            setAllAppointments(updatedAllAppointments);
            filterAppointments(updatedAllAppointments, searchTerm);

            setShowRescheduleModal(false);
            setTimeout(() => setUpdateMessage(''), 3000);
        } catch (error) {
            console.error('Error al reprogramar la cita:', error);
            setUpdateMessage('Error al reprogramar la cita. Inténtalo de nuevo.');
        }
    };
    const calculatePayment = (ibc, precioBase) => {
        if (ibc <= 2600000) {
            return precioBase * 0.117; 
        } else if (ibc > 2600000 && ibc <= 6500000) {
            return precioBase * 0.461; 
        } else {
            return precioBase * 1.215; 
        }
    };
  
    
    // Función para exportar a PDF
const exportToPDF = (appointment) => {
    const doc = new jsPDF('');

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Obtener datos de consulta y paciente
    const consulta = getConsultation(appointment.tipo_consulta);
    const patie = getPatient(appointment.paciente);
    const paymentAmount = calculatePayment(patie.ibc, consulta.precio_base).toFixed(2);

    // Configuración de la tabla en el PDF
    const tableColumn = [
        "Descripción",
        "Valor"
    ];

    const tableRows = [
        ['Factura ID', appointment.id],
        ['Paciente', patie.nombre],
        ['Fecha', new Date().toLocaleDateString()],
        ['Tipo de Consulta', consulta.nombre],
        ['Monto Total', `$${paymentAmount}`],
        ['Estado de Pago', appointment.estado_pago],
    ];

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        headStyles: { fontSize: 12, fillColor: [66, 66, 66], textColor: 255 },
        bodyStyles: { fontSize: 10 },
        columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 80 },
        },
        theme: 'striped',
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text('Este documento es una factura oficial.', 105, pageHeight - 30, { align: 'center' });

    const fechaEmision = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.text(`Documento generado el: ${fechaEmision}`, 105, pageHeight - 10, { align: 'center' });

    doc.save(`Factura_${appointment.id}.pdf`);
};

// Función para manejar la descarga de factura y verificar el ID de la cita
const handleDownloadInvoice = (id) => {
    if (!allAppointments || allAppointments.length === 0) {
        console.error('No se han cargado citas o la lista de citas está vacía');
        return;
    }

    // Buscar el objeto appointment por ID en allAppointments
    const appointment = allAppointments.find(app => app.id === id);
    
    if (appointment) {
        console.log('Cita encontrada:', appointment);
        exportToPDF(appointment);
    } else {
        console.error('Cita no encontrada para ID:', id);
    }
};

    return (
        <div>
            <NavigationBar title={"Gestión de Citas"} />
            <div className="container mt-2">
                {updateMessage && <div className="alert alert-success text-center">{updateMessage}</div>}
                <div className="mb-4 input-group">
                    <span className="input-group-text">
                        <UserSearch size={20} />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        id="searchInput"
                        placeholder="Ingrese el nombre del paciente"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>


                <div className="table-responsive shadow-sm p-3 mb-5 bg-light rounded">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark text-center">
                            <tr>
                                <th>Paciente</th>
                                <th>Médico</th>
                                <th>Fecha y Hora</th>
                                <th>Tipo de Consulta</th> 
                                <th>Valor</th> 
                                <th>Estado Pago</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
    {appointments.length > 0 ? (
        appointments.map((appointment) => {
            const consulta = getConsultation(appointment.tipo_consulta);
            const patie = getPatient(appointment.paciente);
            console.log('Consulta:', JSON.stringify(consulta, null, 2));

            
            const price = typeof consulta.precio_base === 'number' && !isNaN(consulta.precio_base) 
                ? consulta.precio_base.toFixed(2) 
                : 'N/A';
            const paymentAmount = calculatePayment(patie.ibc, consulta.precio_base).toFixed(2);
            const billingStatus = appointment.billing ? appointment.billing.estado_pago : 'Pendiente';

            return (  
                <tr key={appointment.id}>
                    <td>{patie.nombre}</td>
                    <td>{getMedico(appointment.medico)}</td>
                    <td>{new Date(appointment.fecha_hora).toLocaleString()}</td>
                    <td>{consulta.nombre}</td>
                    <td>{paymentAmount}</td> 
                    <td>
                        <span className={`badge ${appointment.estado_pago === 'Pagado' ? 'bg-success' : 'bg-warning'}`}>
                            {appointment.estado_pago || 'Pendiente'}
                        </span>
                    </td>
                    <td>
                        <div className="btn-group">
                            <button 
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleReschedule(appointment)}
                            >
                                <CalendarClock/>
                            </button>
                            <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleCancelAppointment(appointment.id)}
                            >
                                <CalendarX/>
                            </button>
                            {appointment.estado_pago !== 'Pagado' ? (
                                <button 
                                    className="btn btn-success btn-sm ms-2"
                                    onClick={() => handlePayment(appointment)}
                                >
                                    Pagar
                                </button>
                            ) : (
                                <button
                                    className="btn btn-info btn-sm ms-2"
                                    onClick={() => handleDownloadInvoice(appointment.id)}
                                >
                                    <FileDown />
                                </button>
                            )}
                        </div>
                    </td>
                </tr>
            );
        })
    ) : (
        <tr>
            <td colSpan="7" className="text-center">No hay citas programadas para este paciente.</td>
        </tr>
    )}
</tbody>

                </table>
            </div>

            {/* Se tiene en cuenta todo para la realización del pago */}
            {showPaymentModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Procesar Pago</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowPaymentModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="form-group mb-3">
                                    <label>Método de Pago:</label>
                                    <select
                                        className="form-control"
                                        value={paymentInfo.method}
                                        onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value})}
                                    >
                                        <option value="">Seleccione un método</option>
                                        <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                                        <option value="efectivo">Efectivo</option>
                                        <option value="transferencia">Transferencia Bancaria</option>
                                    </select>
                                </div>

                                {paymentInfo.method === 'tarjeta' && (
                                    <>
                                        <div className="form-group mb-3">
                                            <label>Número de Tarjeta:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={paymentInfo.cardNumber}
                                                onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                                                placeholder="1234 5678 9012 3456"
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label>Fecha de Expiración:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={paymentInfo.expiryDate}
                                                    onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                                                    placeholder="MM/AA"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label>CVV:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={paymentInfo.cvv}
                                                    onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                                                    placeholder="123"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                            <div className="form-group mb-3">
                                <label>Monto a Pagar:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={paymentInfo.amount}
                                    onChange={(e) => setPaymentInfo({...paymentInfo, amount: e.target.value})}
                                    readOnly
                                />
                            </div>

                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={handlePaymentSubmit}
                                >
                                    Confirmar Pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showPaymentModal && <div className="modal-backdrop show"></div>}

                {showRescheduleModal && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Reprogramar Cita</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowRescheduleModal(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Nueva Fecha y Hora:</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={newDateTime}
                                            onChange={(e) => setNewDateTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowRescheduleModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleRescheduleSubmit}
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showRescheduleModal && <div className="modal-backdrop show"></div>}
            </div>
        </div>
    );
}