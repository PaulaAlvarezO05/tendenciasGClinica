from django.db import models


class Patient(models.Model):
    
    nombre_completo=models.CharField('Nombres Completo', max_length=200)
    fecha_nacimiento=models.DateField('Fecha de Nacimiento')
    genero = models.CharField('Género', max_length=30)
    direccion=models.CharField('Dirección', max_length=100)
    telefono=models.IntegerField('Teléfono')
    email=models.EmailField('Email', max_length=100)
    nombre_emergencia=models.CharField('Nombre Contacto de Emergencia', max_length=200)
    telefono_emergencia=models.IntegerField('Teléfono de Emergencia')
    compañia_Seguros=models.CharField('Compañia de Seguros', max_length=100)
    numero_poliza=models.IntegerField('Número de Poliza')
    estado_poliza = models.CharField('Estado de Póliza', max_length=20)
    vigencia_poliza=models.DateField('Vigencia de Poliza')
    ibc = models.IntegerField('Ingreso base de cotización', null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_completo} "