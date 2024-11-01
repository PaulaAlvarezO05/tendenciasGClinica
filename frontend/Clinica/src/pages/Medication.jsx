import React, { useEffect, useState } from 'react';
import { addMedicationInv, updateMedication, deleteMedication, getMedicationInventory } from '../api/Clinica.api';
import { Search, PlusCircle, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { NavigationBar } from '../components/NavigationBar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function MedicationInventory() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [formData, setFormData] = useState({
    nombre_medicamento: '',
    descripcion: '',
    cantidad_disponible: '',
    costo: ''
  });
  const [updateMessage, setUpdateMessage] = useState('');

  const fetchMedications = async () => {
    try {
      const response = await getMedicationInventory();
      setMedications(response.data);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedMedication) {
        await updateMedication(selectedMedication.id, formData);
        setUpdateMessage('Medicamento actualizado exitosamente!');
      } else {
        await addMedicationInv(formData);
        setUpdateMessage('Medicamento agregado exitosamente!');
      }

      await fetchMedications();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setUpdateMessage('Error al procesar la solicitud');
    } finally {
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este medicamento?')) {
      try {
        await deleteMedication(id);
        setUpdateMessage('Medicamento eliminado exitosamente!');
        await fetchMedications();
      } catch (error) {
        console.error('Error:', error);
        setUpdateMessage('Error al eliminar el medicamento');
      }
    }
  };

  const handleEdit = (medication) => {
    setSelectedMedication(medication);
    setFormData({
      nombre_medicamento: medication.nombre_medicamento,
      descripcion: medication.descripcion,
      cantidad_disponible: medication.cantidad_disponible,
      costo: medication.costo
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombre_medicamento: '',
      descripcion: '',
      cantidad_disponible: '',
      costo: ''
    });
    setSelectedMedication(null);
  };

  const filteredMedications = medications.filter(med =>
    med.nombre_medicamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Inventario de Medicamentos', 14, 22);

    const tableColumn = ["Nombre", "Descripción", "Cantidad", "Costo"];
    const tableRows = filteredMedications.map(med => [
      med.nombre_medicamento,
      med.descripcion,
      med.cantidad_disponible,
      `$${Number(med.costo).toFixed(2)}`
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      headStyles: { fontSize: 7 },
      bodyStyles: { fontSize: 7 },
      styles: { cellPadding: 1 },
      theme: 'striped'
    });

    doc.save('Inventario_de_Medicamentos.pdf');
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <NavigationBar title={"Inventario de Medicamentos"} />
      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text"><Search size={20} /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar medicamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 text-end">
            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">
              <PlusCircle className="h-4 w-4 me-2 d-inline-block" />
              Agregar Medicamento
            </button>
            <button onClick={exportToPDF} className="btn btn-secondary ms-2">
              Exportar PDF
            </button>
          </div>
        </div>

        {updateMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {updateMessage}
            <button type="button" className="btn-close" onClick={() => setUpdateMessage('')}></button>
          </div>
        )}

        {filteredMedications.map(med =>
          med.cantidad_disponible < 10 && (
            <div key={`alert-${med.id}`} className="alert alert-danger d-flex align-items-center">
              <AlertCircle className="h-4 w-4 me-2" />
              ¡Stock Bajo! {med.nombre_medicamento} tiene {med.cantidad_disponible} unidades
            </div>
          )
        )}

        <div className="table-responsive shadow-sm p-3 mb-5 bg-white rounded">
          <table className="table table-striped table-bordered table-hover">
            <thead className="thead-dark text-center">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Costo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.length > 0 ? (
                filteredMedications.map(medication => (
                  <tr key={medication.id}>
                    <td>{medication.nombre_medicamento}</td>
                    <td>{medication.descripcion}</td>
                    <td className={`text-end ${medication.cantidad_disponible < 10 ? 'text-danger fw-bold' : ''}`}>
                      {medication.cantidad_disponible}
                    </td>
                    <td className="text-end">${Number(medication.costo).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
                    <td className="text-center">
                      <button onClick={() => handleEdit(medication)} className="btn btn-sm btn-outline-primary me-2">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(medication.id)} className="btn btn-sm btn-outline-danger">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No hay medicamentos disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedMedication ? 'Editar' : 'Agregar'} Medicamento</h5>
                  <button type="button" className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {['nombre_medicamento', 'descripcion', 'cantidad_disponible', 'costo'].map((field, index) => (
                      <div className="mb-3" key={index}>
                        <label className="form-label">{field === 'nombre_medicamento' ? 'Nombre del Medicamento' : field === 'descripcion' ? 'Descripción' : field === 'cantidad_disponible' ? 'Cantidad Disponible' : 'Costo'}</label>
                        <input
                          type={field === 'descripcion' ? 'textarea' : 'text'}
                          name={field}
                          className="form-control"
                          value={formData[field]}
                          onChange={handleInputChange}
                          required
                          min={field === 'cantidad_disponible' || field === 'costo' ? '0' : undefined}
                          step={field === 'costo' ? '0.01' : undefined}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">{selectedMedication ? 'Actualizar' : 'Agregar'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicationInventory;
