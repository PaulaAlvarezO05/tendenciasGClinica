from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from ..roles.models import Rol
from ..users.models import User
from .models import MedicationInventory

class MedicationInventoryAPITest(TestCase):

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

        self.medicationInventory_data = {
            "nombre_medicamento": "Paracetamol",
            "descripcion": "Analgésico y antipirético",
            "cantidad_disponible": 100,
            "costo": 12500
        }
        self.medication = MedicationInventory.objects.create(**self.medicationInventory_data)

    def test_get_list_medicationInventory(self):
        url = reverse('medicationInventory-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_detail_medicationInventory(self):
        url = reverse('medicationInventory-detail', args=[self.medication.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre_medicamento'], self.medication.nombre_medicamento)

    def test_create_medication(self):
        url = reverse('medicationInventory-list')
        new_medication_data = {
            "nombre_medicamento": "Ibuprofeno",
            "descripcion": "Antiinflamatorio no esteroideo",
            "cantidad_disponible": 50,
            "costo": 15000
        }
        response = self.client.post(url, new_medication_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nombre_medicamento'], new_medication_data['nombre_medicamento'])

    def test_update_medication(self):
        url = reverse('medicationInventory-detail', args=[self.medication.id])
        updated_data = {
            "nombre_medicamento": "Paracetamol",
            "descripcion": "Analgésico y antipirético con dosis mejorada",
            "cantidad_disponible": 80,
            "costo": 13000
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['descripcion'], "Analgésico y antipirético con dosis mejorada")
        self.assertEqual(response.data['cantidad_disponible'], 80)

    def test_delete_medication(self):
        url = reverse('medicationInventory-detail', args=[self.medication.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(MedicationInventory.objects.filter(id=self.medication.id).exists())
