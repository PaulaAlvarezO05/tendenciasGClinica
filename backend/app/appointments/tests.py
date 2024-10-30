from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from ..patients.models import Patient
from ..roles.models import Rol
from ..users.models import User
from ..medicalSpecialties.models import MedicalSpecialty
from ..consultationType.models import ConsultationType
from ..billing.models import Billing
from .models import Appointment

class AppointmentAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.rol = Rol.objects.create(nombre="Médico")
        self.medico = User.objects.create_user(
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
        self.client.force_authenticate(user=self.medico)
        
        self.patient = Patient.objects.create(
            nombre_completo="Jane Doe",
            fecha_nacimiento="1995-05-05",
            genero="F",
            direccion="456 Another St",
            telefono=1234567890,
            email="jane@example.com",
            nombre_emergencia="John Doe",
            telefono_emergencia=9876543210,
            compañia_Seguros="Seguros de Salud",
            numero_poliza=123456789,
            estado_poliza="A",
            vigencia_poliza="2026-01-01",
            ibc=3500000
        )

        self.medical_specialty = MedicalSpecialty.objects.create(nombre="Cardiología")
        
        self.consultation_type = ConsultationType.objects.create(
            nombre="Consulta con especialista en cardiología",
            especialidad=self.medical_specialty,
            precio_base="50000.00"
        )
        
        self.billing = Billing.objects.create(
            paciente=self.patient,
            fecha="2023-10-01",
            monto=50000,
            detalles="Consulta con especialista",
            estado_pago="Pendiente"
        )
        
        self.appointment = Appointment.objects.create(
            paciente=self.patient,
            medico=self.medico,
            fecha_hora=timezone.now(),
            tipo_consulta=self.consultation_type,
            estado="Programada",
            estado_pago="Pendiente",
            billing=self.billing
        )

    def test_get_list_appointments(self):
        url = reverse('appointments-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_detail_appointment(self):
        url = reverse('appointments-detail', args=[self.appointment.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['estado'], self.appointment.estado)

    def test_create_appointment(self):
        url = reverse('appointments-list')
        new_billing_data = {
            "paciente": self.patient,
            "fecha": "2023-10-01",
            "monto": 50000,
            "detalles": "Consulta con especialista",
            "estado_pago": "Pendiente"
        }
        new_billing = Billing.objects.create(**new_billing_data)
        new_appointment_data = {
            "paciente": self.patient.id,
            "medico": self.medico.id,
            "fecha_hora": timezone.now(),
            "tipo_consulta": self.consultation_type.id,
            "estado": "Programada",
            "estado_pago": "Pendiente",
            "billing": new_billing.id
        }
        response = self.client.post(url, new_appointment_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['estado'], new_appointment_data['estado'])

    def test_update_appointment(self):
        url = reverse('appointments-detail', args=[self.appointment.id])
        updated_data = {
            "paciente": self.patient.id,
            "medico": self.medico.id,
            "fecha_hora": self.appointment.fecha_hora,
            "tipo_consulta": self.consultation_type.id,
            "estado": "Completada",
            "estado_pago": self.appointment.estado_pago,
            "billing": self.billing.id
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['estado'], "Completada")

    def test_delete_appointment(self):
        url = reverse('appointments-detail', args=[self.appointment.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Appointment.objects.filter(id=self.appointment.id).exists())
