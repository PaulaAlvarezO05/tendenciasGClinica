from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from ..roles.models import Rol
from ..users.models import User
from ..medicalSpecialties.models import MedicalSpecialty
from .models import ConsultationType

class ConsultationTypeAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()
        
        self.rol = Rol.objects.create(nombre="Administrador")
        self.user = User.objects.create_user(
            username="jdoe",
            password="password123",
            email="isabela@example.com",
            nombres="Isabela",
            apellidos="Montenegro García",
            telefono="5512345678",
            fecha_nacimiento="1982-03-15",
            direccion="Calle Sauce 187, Col. San Lucas, Coyoacán, CDMX",
            rol=self.rol
        )
        self.client.force_authenticate(user=self.user)

        self.medicalspecialty = MedicalSpecialty.objects.create(nombre="Cardiología")
        self.consultationType_data = {
            "nombre": "Consulta con médico general",
            "especialidad": self.medicalspecialty,
            "precio_base": "50000.00"
        }
        self.consultationType = ConsultationType.objects.create(**self.consultationType_data)

    def test_get_list_consultationType(self):
        url = reverse('consultationType-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_detail_consultationType(self):
        url = reverse('consultationType-detail', args=[self.consultationType.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], self.consultationType.nombre)
        self.assertEqual(response.data['precio_base'], str(self.consultationType.precio_base))
        self.assertEqual(response.data['especialidad'], self.medicalspecialty.id)

    def test_create_consultationType(self):
        url = reverse('consultationType-list')
        new_consultationType_data = {
            "nombre": "Consulta con especialista en neurología",
            "especialidad": self.medicalspecialty.id,
            "precio_base": "100000.00"
        }
        response = self.client.post(url, new_consultationType_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nombre'], new_consultationType_data['nombre'])
        self.assertEqual(response.data['precio_base'], new_consultationType_data['precio_base'])

    def test_update_consultationType(self):
        url = reverse('consultationType-detail', args=[self.consultationType.id])
        updated_data = {
            "nombre": "Consulta con especialista en cardiología",
            "especialidad": self.medicalspecialty.id,
            "precio_base": "75000.00"
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], updated_data['nombre'])
        self.assertEqual(response.data['precio_base'], updated_data['precio_base'])

    def test_delete_consultationType(self):
        url = reverse('consultationType-detail', args=[self.consultationType.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ConsultationType.objects.filter(id=self.consultationType.id).exists())
