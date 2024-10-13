from django.db import models
from ..medicalRecords.models import MedicalRecord
from ..medicationInventory.models import MedicationInventory

class Prescription(models.Model):
    historia_clinica = models.ForeignKey(
        MedicalRecord,
        verbose_name="Historia Clínica",
        on_delete=models.CASCADE,
        null=True, 
        blank=True
    )
    
    medicamento = models.ForeignKey(
        MedicationInventory,
        verbose_name="Medicamento",
        on_delete=models.CASCADE,
        null=True, 
        blank=True
    )
    
    via_administracion = models.CharField("Vía de Administración", max_length=20)
    dosis = models.CharField("Dosis", max_length=100)
    frecuencia = models.CharField("Frecuencia", max_length=100)
    duracion = models.CharField("Duración del tratamiento", max_length=100)
    instrucciones = models.TextField("Instrucciones adicionales", blank=True, null=True)

    def __str__(self):
        return f"Prescripción de {self.medicamento}"


