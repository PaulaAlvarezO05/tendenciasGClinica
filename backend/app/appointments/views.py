from rest_framework import viewsets
from .models import *
from .serializers import *
from ..roles.permissions import *

class AppointmentViewset(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        
        if user.rol.nombre in ['Administrador', 'Asistente Administrativo']:
            return Appointment.objects.all()

        if user.rol.nombre == 'Médico':
            return Appointment.objects.filter(medico=user)

        return Appointment.objects.none()

    def get_permissions(self):
        user = self.request.user
        
        if user.rol.nombre == 'Administrador':
            return []

        if self.action in ['list', 'update']:
            self.permission_classes = [IsMedico]
        elif self.action in ['list', 'create', 'update']:
            self.permission_classes = [IsAsistAdmin]

        return super().get_permissions()
    
