from django.db import models
from ..patients.models import Patient
from ..users.models import User
from ..consultationType.models import ConsultationType

class Appointment(models.Model):
  paciente = models.ForeignKey(
     Patient, 
     verbose_name="Paciente", 
     on_delete=models.CASCADE,
     null=True, 
     blank=True
  )
  medico = models.ForeignKey(
     User,
     verbose_name="Médico", 
     on_delete=models.CASCADE,
     limit_choices_to={'rol__nombre': 'Médico'},
     null=True, 
     blank=True
  ) 
  fecha_hora = models.DateTimeField("Fecha y hora")
  tipo_consulta = models.ForeignKey(
     ConsultationType,
     verbose_name="Tipo de consulta", 
     on_delete=models.SET_NULL,
     null=True
  )
  estado = models.CharField(max_length=20, default='Programada')

  def __str__(self):
    return f"Médico: {self.medico.nombres} {self.medico.apellidos} Fecha: {self.fecha_hora}"