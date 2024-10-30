from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from ..patients.models import Patient
from ..roles.models import Rol
from ..users.models import User
from ..medicalRecords.models import MedicalRecord
from ..medicationInventory.models import MedicationInventory
from .models import Prescription

class PrescriptionAPITest(TestCase):

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

        self.medication = MedicationInventory.objects.create(
            nombre_medicamento="Ibuprofeno",
            descripcion="Analgesico",
            cantidad_disponible=100,
            costo=5000
        )

        self.prescription = Prescription.objects.create(
            historia_clinica=self.medicalRecord,
            medicamento=self.medication,
            via_administracion="Oral",
            dosis="1 tableta",
            frecuencia="Cada 8 horas",
            duracion="5 días",
            instrucciones="Tomar después de las comidas."
        )

    def test_get_list_prescriptions(self):
        url = reverse('prescriptions-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_detail_prescription(self):
        url = reverse('prescriptions-detail', args=[self.prescription.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['historia_clinica'], self.prescription.historia_clinica.id)

    def test_create_prescription(self):
        url = reverse('prescriptions-list')
        new_prescription_data = {
            "historia_clinica": self.medicalRecord.id,
            "medicamento": self.medication.id,
            "via_administracion": "Oral",
            "dosis": "1 tableta",
            "frecuencia": "Cada 12 horas",
            "duracion": "7 días",
            "instrucciones": "Tomar antes de las comidas."
        }
        response = self.client.post(url, new_prescription_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['historia_clinica'], new_prescription_data['historia_clinica'])

    def test_update_prescription(self):
        url = reverse('prescriptions-detail', args=[self.prescription.id])
        updated_data = {
            "historia_clinica": self.medicalRecord.id,
            "medicamento": self.medication.id,
            "via_administracion": "Oral",
            "dosis": "2 tableta",
            "frecuencia": "Cada 8 horas",
            "duracion": "10 días",
            "instrucciones": "Tomar con agua."
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['dosis'], "2 tableta")

    def test_delete_prescription(self):
        url = reverse('prescriptions-detail', args=[self.prescription.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Prescription.objects.filter(id=self.prescription.id).exists())
