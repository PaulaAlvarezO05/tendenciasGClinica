from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from .models import Rol
from ..users.models import User

class RolAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.rol = Rol.objects.create(nombre="Médico")
        
        self.rolA = Rol.objects.create(nombre="Administrador")
        self.user = User.objects.create_user(
            username="jdoe",
            password="password123",
            email="isabela@example.com",
            nombres="Isabela",
            apellidos="Montenegro García",
            telefono="5512345678",
            fecha_nacimiento="1982-03-15",
            direccion="Calle Sauce 187, Col. San Lucas, Coyoacán, CDMX",
            rol=self.rolA
        )
        self.client.force_authenticate(user=self.user)

    def test_get_list_rol(self):
        url = reverse('roles-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_detail_rol(self):
        url = reverse('roles-detail', args=[self.rol.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], self.rol.nombre)

    def test_create_rol(self):
        url = reverse('roles-list')
        new_rol_data = {"nombre": "Enfermero"}
        response = self.client.post(url, new_rol_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nombre'], new_rol_data['nombre'])

    def test_update_rol(self):
        url = reverse('roles-detail', args=[self.rol.id])
        updated_data = {"nombre": "Médico General"}
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], "Médico General")

    def test_delete_rol(self):
        url = reverse('roles-detail', args=[self.rol.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Rol.objects.filter(id=self.rol.id).exists())