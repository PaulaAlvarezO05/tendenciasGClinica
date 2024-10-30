from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from ..roles.models import Rol
from ..users.models import User
from ..patients.models import Patient
from .models import Billing

class BillingAPITest(TestCase):

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
        self.patient = Patient.objects.create(**self.patient_data)
        self.billing_data = {
            "paciente": self.patient,
            "fecha": "2023-10-01",
            "monto": 50000,
            "detalles": "Consulta con médico general",
            "estado_pago": "Pendiente"
        }
        self.billing = Billing.objects.create(**self.billing_data)

    def test_get_list_billing(self):
        url = reverse('billing-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_detail_billing(self):
        url = reverse('billing-detail', args=[self.billing.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detalles'], self.billing.detalles)

    def test_create_billing(self):
        url = reverse('billing-list')
        new_billing_data = {
            "paciente": self.patient.id,
            "fecha": "2024-01-15",
            "monto": 75000,
            "detalles": "Examen de laboratorio",
            "estado_pago": "Pagado"
        }
        response = self.client.post(url, new_billing_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['detalles'], new_billing_data['detalles'])
        self.assertEqual(response.data['estado_pago'], "Pagado")

    def test_update_billing(self):
        url = reverse('billing-detail', args=[self.billing.id])
        updated_data = {
            "paciente": self.billing.paciente.id,
            "fecha": self.billing.fecha,
            "monto": self.billing.monto,
            "detalles": self.billing.detalles,
            "estado_pago": "Pagado"
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['estado_pago'], "Pagado")

    def test_delete_billing(self):
        url = reverse('billing-detail', args=[self.billing.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Billing.objects.filter(id=self.billing.id).exists())
