import React, { useContext } from 'react';
import { CalendarPlus2, Calendar, ClipboardList } from 'lucide-react';
import { AuthContext } from '../api/AuthContext';
import PanelLayout from '../components/PanelLayout';
import ServiceCard from '../components/ServiceCard';

const AsistentePanel = () => {
  const { name, lastName } = useContext(AuthContext);
  const medicoName = `${name} ${lastName}`;
  
  const services = [
    { Component: ServiceCard, icon: <CalendarPlus2 size={48} />, title: 'Agendar Citas', link: '/add-appointment' },
    { Component: ServiceCard, icon: <Calendar size={48} />, title: 'Gestionar Citas', link: '/edit-appointments' },
    { Component: ServiceCard, icon: <ClipboardList size={48} />, title: 'Facturación', link: '#' }
  ];

  return <PanelLayout userType="" userName={medicoName} services={services} />;
};

export default AsistentePanel;