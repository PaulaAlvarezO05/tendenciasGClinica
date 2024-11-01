import React, { useEffect, useState } from 'react';
import { getBillings } from '../api/Clinica.api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { NavigationBar } from '../components/NavigationBar';
import { Search, Download } from 'lucide-react';

export function ListBillings() {
    const [billings, setBillings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadBillings = async () => {
            try {
                const response = await getBillings();
                setBillings(response.data);
            } catch (error) {
                console.error("Error al cargar las facturas:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBillings();
    }, []);

    const exportToPDF = (billing) => {
        const doc = new jsPDF('');

        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('FACTURA', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(18);

        const tableColumn = [
            "Descripción",
            "Valor"
        ];

        const tableRows = [
            ['Factura ID', billing.id],
            ['Paciente', billing.paciente_nombre],
            ['Fecha', new Date(billing.fecha).toLocaleDateString()],
            ['Estado de Pago', billing.estado_pago],
            ['Detalles', billing.detalles],
            ['Monto Total', `$${parseFloat(billing.monto).toFixed(2)}`]
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

        doc.save(`Factura_${billing.id}.pdf`);
    };

    const filteredBillings = billings.filter(billing =>
        (billing.paciente_nombre && billing.paciente_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (billing.detalles && billing.detalles.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <NavigationBar title={"Listado de Facturas"} />
            <div className="container-fluid mt-2">
                <div className="row mb-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <Search size={20} />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar factura por paciente o detalles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive shadow-sm p-3 mb-4 bg-white rounded">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark text-center">
                            <tr>
                                <th>ID</th>
                                <th>Paciente</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Detalles</th>
                                <th>Estado de Pago</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBillings.map(billing => (
                                <tr key={billing.id}>
                                    <td>{billing.id}</td>
                                    <td>{billing.paciente_nombre}</td>
                                    <td>{new Date(billing.fecha).toLocaleDateString()}</td>
                                    <td>{billing.monto}</td>
                                    <td>{billing.detalles}</td>
                                    <td>{billing.estado_pago}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => exportToPDF(billing)}
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

export default ListBillings;
