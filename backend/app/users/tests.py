from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from ..roles.models import Rol
from .models import User

class UserAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.rol = Rol.objects.create(nombre="Administrador")
        self.user = User.objects.create_user(
            username="michael123",
            password="mypassword!",
            email="michael@example.com",
            nombres="Michael",
            apellidos="Smith",
            telefono="1234567890",
            fecha_nacimiento="1990-01-15",
            direccion="789 Elm St, Springfield",
            rol=self.rol
        )
        self.client.force_authenticate(user=self.user)

    def test_get_list_user(self):
        url = reverse('users-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_detail_user(self):
        url = reverse('users-detail', args=[self.user.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombres'], self.user.nombres)

    def test_create_user(self):
        url = reverse('users-list') 
        new_user_data = {
            "username": "janedoe",
            "password": "securepassword",
            "email": "jane@example.com",
            "nombres": "Jane",
            "apellidos": "Doe",
            "telefono": "0987654321",
            "fecha_nacimiento": "1995-05-05",
            "direccion": "456 Another St",
            "rol": self.rol.id,
        }
        response = self.client.post(url, new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nombres'], new_user_data['nombres'])

    def test_update_user(self):
        url = reverse('users-detail', args=[self.user.id])
        updated_data = {
            "email": "isabela@example.com",
            "nombres": "Isabel",
            "apellidos": "Montenegro García",
            "telefono": "1112223333",
            "fecha_nacimiento": "1982-03-15",
            "direccion": "Calle Sauce 187, Col. San Lucas, Coyoacán, CDMX",
            "rol": self.rol.id
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombres'], "Isabel")

    def test_delete_user(self):
        url = reverse('users-detail', args=[self.user.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=self.user.id).exists())
