import React from 'react';
import { Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon, title, link }) => (
  <Link to={link} style={{ textDecoration: 'none' }}>
    <Card className="text-center p-3 m-2" style={{ width: '150px', cursor: 'pointer' }}>
      {icon}
      <Card.Body>
        <Card.Text>{title}</Card.Text>
      </Card.Body>
    </Card>
  </Link>
);

export default ServiceCard;