import React, { useContext } from 'react';
import { Calendar, FileText, ClipboardList, Pill } from 'lucide-react';
import { AuthContext } from '../api/AuthContext';
import PanelLayout from '../components/PanelLayout';
import ServiceCard from '../components/ServiceCard';

const AsistentePanel = () => {
  const { name, lastName } = useContext(AuthContext);
  const medicoName = `${name} ${lastName}`;
  
  const services = [
    { Component: ServiceCard, icon: <Calendar size={48} />, title: 'Agendar Citas', link: '/add-appointment' },
    { Component: ServiceCard, icon: <Calendar size={48} />, title: 'Cancelar Citas', link: '/edit-appointments' },
    { Component: ServiceCard, icon: <Pill size={48} />, title: 'Medicamentos', link: '#' },
    { Component: ServiceCard, icon: <ClipboardList size={48} />, title: 'Facturación', link: '#' }
    
  ];

  return <PanelLayout userType="" userName={medicoName} services={services} />;
};

export default AsistentePanel;