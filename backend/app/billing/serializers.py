from rest_framework import serializers
from .models import * 

class BillingSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(source='paciente.nombre_completo', read_only=True)

    class Meta:
        model = Billing
        fields = ('id', 'paciente', 'fecha', 'monto', 'detalles', 'estado_pago', 'paciente_nombre')
