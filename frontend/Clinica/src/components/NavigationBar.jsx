import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, ArrowRight } from 'lucide-react';
import { AuthContext } from '../api/AuthContext';

export function NavigationBar({title}) {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm py-2 px-4 mb-4">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <button 
                            className="btn btn-outline-secondary me-2"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>
                    <h2 className="text-center">{title}</h2>
                    <button 
                        className="btn btn-danger"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} className="me-2" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}