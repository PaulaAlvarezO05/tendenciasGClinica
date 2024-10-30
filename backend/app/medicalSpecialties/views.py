from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from ..roles.permissions import *

class MedicalSpecialtyViewset(viewsets.ModelViewSet):
    queryset = MedicalSpecialty.objects.all()
    serializer_class = MedicalSpecialtySerializer

    def get_queryset(self):
        user = self.request.user
        
        if user.rol.nombre in ['Administrador']:
            return MedicalSpecialty.objects.all()
        
        return MedicalSpecialty.objects.none()

    def get_permissions(self):
        user = self.request.user
        permission_classes = []
        
        if user.rol.nombre == 'Administrador':
            permission_classes = [IsAdmin]
        
        self.permission_classes = permission_classes
        return super().get_permissions()