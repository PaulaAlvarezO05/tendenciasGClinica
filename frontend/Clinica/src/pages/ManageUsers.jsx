import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, List } from 'lucide-react';
import { NavigationBar } from '../components/NavigationBar';

export function ManageUsers() {
    const services = [
        { icon: <UserPlus size={48} />, title: 'Registro Empleados', link: '/add-user' },
        { icon: <Users size={48} />, title: 'Actualización Empleados', link: '/update-user' },
        { icon: <List size={48} />, title: 'Listado Empleados', link: '/list-user' }
    ];

    return (
        <div>
            <NavigationBar title="Gestión de Empleados" />
            <div className="container text-center">
                <div className="row justify-content-center">
                    {services.map((service, index) => (
                        <div className="col-md-4 mb-4" key={index}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '200px',
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                padding: '20px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}>
                                <Link to={service.link} style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', width: '100%' }}>
                                    {service.icon}
                                    <h5>{service.title}</h5>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
