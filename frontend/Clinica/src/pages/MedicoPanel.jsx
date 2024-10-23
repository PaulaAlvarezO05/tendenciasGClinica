import React, { useContext } from 'react';
import { Calendar, FileText, ClipboardList, Pill } from 'lucide-react';
import { AuthContext } from '../api/AuthContext';
import PanelLayout from '../components/PanelLayout';
import ServiceCard from '../components/ServiceCard';

const MedicoPanel = () => {
  const { name, lastName } = useContext(AuthContext);
  const medicoName = `${name} ${lastName}`;
  
  const services = [
    { Component: ServiceCard, icon: <Calendar size={48} />, title: 'Gestionar citas', link: '/list-appointments' }
  ];

  return <PanelLayout userType="Doctor(a)" userName={medicoName} services={services} />;
};

export default MedicoPanel;