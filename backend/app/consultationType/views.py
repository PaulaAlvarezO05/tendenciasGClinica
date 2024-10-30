from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from ..roles.permissions import *

class ConsultationTypeViewset(viewsets.ModelViewSet):
    queryset = ConsultationType.objects.all()
    serializer_class = ConsultationTypeSerializer

    def get_queryset(self):
        user = self.request.user
        
        if user.rol.nombre in ['Administrador', 'Asistente Administrativo']:
            return ConsultationType.objects.all()
        
        return ConsultationType.objects.none()

    def get_permissions(self):
        user = self.request.user
        permission_classes = []
        
        if user.rol.nombre == 'Administrador':
            permission_classes = [IsAdmin]
        elif user.rol.nombre == 'Asistente Administrativo':
            if self.action in ['list', 'retrieve']:
                permission_classes = [IsAsistAdmin]
        
        self.permission_classes = permission_classes
        return super().get_permissions()
