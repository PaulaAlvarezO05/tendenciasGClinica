from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from ..patients.models import Patient
from ..roles.models import Rol
from ..users.models import User
from .models import MedicalRecord

class MedicalRecordAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

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
        
        self.medicalRecord = MedicalRecord.objects.create(
            paciente=self.patient,
            medico=self.medico,
            fecha_registro=timezone.now(),
            motivo_consulta="Dolor de cabeza persistente",
            descripcion_diagnostico="Migraña"
        )

    def test_get_list_medicalRecords(self):
        url = reverse('medicalRecords-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_detail_medicalRecord(self):
        url = reverse('medicalRecords-detail', args=[self.medicalRecord.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['paciente'], self.medicalRecord.paciente.id)

    def test_create_medicalRecord(self):
        url = reverse('medicalRecords-list')
        new_medicalRecord_data = {
            "paciente": self.patient.id,
            "medico": self.medico.id,
            "fecha_registro": timezone.now(),
            "motivo_consulta": "Dificultad para respirar",
            "descripcion_diagnostico": "Asma"
        }
        response = self.client.post(url, new_medicalRecord_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['paciente'], new_medicalRecord_data['paciente'])

    def test_update_medicalRecord(self):
        url = reverse('medicalRecords-detail', args=[self.medicalRecord.id])
        updated_data = {
            "paciente": self.patient.id,
            "medico": self.medico.id,
            "fecha_registro": timezone.now(),
            "motivo_consulta": "Dolor de cabeza palpitante y sensación de vómito",
            "descripcion_diagnostico": "Migraña"
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['motivo_consulta'], "Dolor de cabeza palpitante y sensación de vómito")

    def test_delete_medicalRecord(self):
        url = reverse('medicalRecords-detail', args=[self.medicalRecord.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(MedicalRecord.objects.filter(id=self.medicalRecord.id).exists())
