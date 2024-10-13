from django.db import models

class MedicationInventory(models.Model):
    nombre_medicamento=models.CharField('Nombre Medicamento', max_length=50)
    descripcion=models.TextField('Descripción', max_length=200)
    cantidad_disponible=models.IntegerField('Cantidad Disponible')
    costo=models.DecimalField('Costo', max_digits=15, decimal_places=2)

    def __str__(self):
        return f"{self.nombre_medicamento}{self.cantidad_disponible}"