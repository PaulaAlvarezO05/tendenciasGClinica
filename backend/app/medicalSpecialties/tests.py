from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from ..roles.models import Rol
from ..users.models import User
from .models import MedicalSpecialty

class MedicalSpecialtyAPITest(TestCase):

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
        self.medicalspecialty_data = {"nombre": "Cardiología"}
        self.medicalspecialty = MedicalSpecialty.objects.create(**self.medicalspecialty_data)

    def test_get_list_medicalSpecialty(self):
        url = reverse('medicalSpecialties-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_detail_medicalSpecialty(self):
        url = reverse('medicalSpecialties-detail', args=[self.medicalspecialty.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], self.medicalspecialty.nombre)

    def test_create_specialty(self):
        url = reverse('medicalSpecialties-list')
        new_medicalSpecialty_data = {"nombre": "Neurología"}
        response = self.client.post(url, new_medicalSpecialty_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nombre'], new_medicalSpecialty_data['nombre'])

    def test_update_specialty(self):
        url = reverse('medicalSpecialties-detail', args=[self.medicalspecialty.id])
        updated_data = {"nombre": "Cardiología General"}
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], "Cardiología General")

    def test_delete_specialty(self):
        url = reverse('medicalSpecialties-detail', args=[self.medicalspecialty.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(MedicalSpecialty.objects.filter(id=self.medicalspecialty.id).exists())