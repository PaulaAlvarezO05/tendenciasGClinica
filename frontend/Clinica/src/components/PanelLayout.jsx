import React, { useContext } from 'react';
import { Card, Container, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../api/AuthContext';

const PanelLayout = ({ userType, userName, services }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container className="mt-4 container">
      <Card className="p-4 shadow-sm" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h2>Hola, {userType} {userName}</h2>
          <Button 
            variant="outline-danger" 
            onClick={handleLogout}
            className="px-4"
          >
            Cerrar Sesión
          </Button>
        </div>
        <h3 className="mt-4">Servicios</h3>
        <Row className="justify-content-center">
          {services.map((service, index) => (
            <service.Component 
              key={index} 
              icon={service.icon} 
              title={service.title} 
              link={service.link} 
            />
          ))}
        </Row>
      </Card>
    </Container>
  );
};

export default PanelLayout;