import React, { useContext } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
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
            <Col xs={12} sm={6} md={4} lg={2} key={index} className="mb-4 d-flex justify-content-center"> 
              <div className="text-center">
              <service.Component 
                icon={<span className="d-flex justify-content-center">{service.icon}</span>} 
                title={service.title} 
                link={service.link} 
              />
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </Container>
  );
};

export default PanelLayout;
