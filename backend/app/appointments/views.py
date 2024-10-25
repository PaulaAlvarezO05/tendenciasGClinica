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
        permission_classes = []
        
        if user.rol.nombre == 'Administrador':
            permission_classes = [IsAdmin]
        elif user.rol.nombre == 'Médico':
            if self.action in ['list', 'retrieve', 'update']:
                permission_classes = [IsMedico]
        elif user.rol.nombre == 'Asistente Administrativo':
            if self.action in ['list', 'retrieve', 'create', 'update']:
                permission_classes = [IsAsistAdmin]
                
        self.permission_classes = permission_classes
        return super().get_permissions()