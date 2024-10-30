from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from ..roles.permissions import *

class PrescriptionViewset(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user

        if user.rol.nombre == 'Administrador':
            return Prescription.objects.all()
        
        if user.rol.nombre == 'Médico':
            return Prescription.objects.all()  

        return Prescription.objects.none()

    def get_permissions(self):
        user = self.request.user
        permission_classes = []

        if user.rol.nombre == 'Administrador':
            permission_classes = [IsAdmin]
        elif user.rol.nombre == 'Médico':
            if self.action in ['list', 'create']:
                permission_classes = [IsMedico]
        
        self.permission_classes = permission_classes
        return super().get_permissions()

    
