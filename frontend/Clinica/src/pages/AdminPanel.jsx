import React, { useContext } from 'react';
import { Calendar, FileText, ClipboardList, Pill } from 'lucide-react';
import { AuthContext } from '../api/AuthContext';
import PanelLayout from '../components/PanelLayout';
import ServiceCard from '../components/ServiceCard';

const MedicoPanel = () => {
  const { name, lastName } = useContext(AuthContext);
  const medicoName = `${name} ${lastName}`;
  console.log(name, lastName);
  
  const services = [
    { Component: ServiceCard, icon: <Calendar size={48} />, title: 'Agenda', link: '/doctor-agenda' },
    { Component: ServiceCard, icon: <Calendar size={48} />, title: 'Gestionar citas', link: '/list-appointments' },
    { Component: ServiceCard, icon: <FileText size={48} />, title: 'Historia clínica', link: '#' },
    { Component: ServiceCard, icon: <ClipboardList size={48} />, title: 'Autorización de órdenes y solicitud de servicios', link: '#' },
    { Component: ServiceCard, icon: <FileText size={48} />, title: 'Transcripción de Incapacidades', link: '#' },
    { Component: ServiceCard, icon: <Pill size={48} />, title: 'Medicamentos', link: '#' }
  ];

  return <PanelLayout userType="Doctor" userName={medicoName} services={services} />;
};

export default MedicoPanel;