import React, { useContext } from 'react';
import { Calendar, FileText, ClipboardList, Pill } from 'lucide-react';
import { AuthContext } from '../api/AuthContext';
import PanelLayout from '../components/PanelLayout';
import ServiceCard from '../components/ServiceCard';

const AdminPanel = () => {
  const { name, lastName } = useContext(AuthContext);
  const medicoName = `${name} ${lastName}`;
  
  const services = [
    { Component: ServiceCard, icon: <Calendar size={48} />, title: 'Listado de pacientes', link: '#' },
    { Component: ServiceCard, icon: <Calendar size={48} />, title: 'Listado de empleados', link: '#' },
    { Component: ServiceCard, icon: <Calendar size={48} />, title: 'Listado de Citas', link: '/list-appointments' },
    { Component: ServiceCard, icon: <FileText size={48} />, title: 'Historias clínicas', link: '#' },
    { Component: ServiceCard, icon: <Pill size={40} />, title: 'Medicamentos', link: '#' },
    { Component: ServiceCard, icon: <ClipboardList size={48} />, title: 'Facturación', link: '#' }
    
  ];

  return <PanelLayout userType="" userName={medicoName} services={services} />;
};

export default AdminPanel;