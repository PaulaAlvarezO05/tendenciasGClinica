import React, { useContext } from 'react';
import { Users, UserCog, CalendarDays, FileText, Pill, Receipt } from 'lucide-react';
import { AuthContext } from '../api/AuthContext';
import PanelLayout from '../components/PanelLayout';
import ServiceCard from '../components/ServiceCard';

const AdminPanel = () => {
  const { name, lastName } = useContext(AuthContext);
  const medicoName = `${name} ${lastName}`;
  
  const services = [
    { Component: ServiceCard, icon: <Users size={48} />, title: 'Listado de pacientes', link: '/list-patient' },
    { Component: ServiceCard, icon: <UserCog  size={48} />, title: 'Listado de empleados', link: '/list-user' },
    { Component: ServiceCard, icon: <CalendarDays  size={48} />, title: 'Listado de Citas', link: '/list-appointments' },
    { Component: ServiceCard, icon: <FileText size={48} />, title: 'Historias clínicas', link: '/list-medical-records-patients' },
    { Component: ServiceCard, icon: <Pill size={40} />, title: 'Medicamentos', link: '#' },
    { Component: ServiceCard, icon: <Receipt  size={48} />, title: 'Facturación', link: '#' }
    
  ];

  return <PanelLayout userType="" userName={medicoName} services={services} />;
};

export default AdminPanel;