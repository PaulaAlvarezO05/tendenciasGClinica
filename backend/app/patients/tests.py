from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from ..roles.models import Rol
from ..users.models import User
from .models import Patient

class PatientAPITest(TestCase):

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

        self.patient_data = {
            "nombre_completo": "Luna Ortega Villaseñor",
            "fecha_nacimiento": "1987-11-23",
            "genero": "F",
            "direccion": "Av. de los Naranjos 742, Piso 3, Col. Jardines del Bosque",
            "telefono": 5524678912,
            "email": "luna.ortega@ejemplo.com",
            "nombre_emergencia": "Miguel Villaseñor",
            "telefono_emergencia": 5523498765,
            "compañia_Seguros": "Protección Total Seguros",
            "numero_poliza": 789654321,
            "estado_poliza": "A",
            "vigencia_poliza": "2026-05-14",
            "ibc": 4200000
        }
        self.patient = Patient.objects.create(**self.patient_data)

    def test_get_list_patient(self):
        url = reverse('patients-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_detail_patient(self):
        url = reverse('patients-detail', args=[self.patient.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre_completo'], self.patient.nombre_completo)

    def test_create_patient(self):
        url = reverse('patients-list') 
        new_patient_data = {
            "nombre_completo": "Jane Doe",
            "fecha_nacimiento": "1995-05-05",
            "genero": "F",
            "direccion": "456 Another St",
            "telefono": 1234567890,
            "email": "jane@example.com",
            "nombre_emergencia": "John Doe",
            "telefono_emergencia": 9876543210,
            "compañia_Seguros": "Seguros de Salud",
            "numero_poliza": 123456789,
            "estado_poliza": "A",
            "vigencia_poliza": "2026-01-01",
            "ibc": 3500000
        }
        response = self.client.post(url, new_patient_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nombre_completo'], new_patient_data['nombre_completo'])

    def test_update_patient(self):
        url = reverse('patients-detail', args=[self.patient.id])
        updated_data = {
            "nombre_completo": "Luna Ortega Villaseñor",
            "fecha_nacimiento": "1987-11-23",
            "genero": "F",
            "direccion": self.patient.direccion,
            "telefono": self.patient.telefono,
            "email": "luna.ortega@ejemplo.com",
            "nombre_emergencia": self.patient.nombre_emergencia,
            "telefono_emergencia": 5523423235,
            "compañia_Seguros": self.patient.compañia_Seguros,
            "numero_poliza": self.patient.numero_poliza,
            "estado_poliza": "I",
            "vigencia_poliza": "2024-05-14",
            "ibc": 4200000
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['vigencia_poliza'], "2024-05-14")

    def test_delete_patient(self):
        url = reverse('patients-detail', args=[self.patient.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Patient.objects.filter(id=self.patient.id).exists())
