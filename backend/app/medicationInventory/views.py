from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from ..roles.permissions import *

class MedicationInViewset(viewsets.ModelViewSet):
    queryset = MedicationInventory.objects.all()
    serializer_class = MedicationInSerializer

    def get_queryset(self):
        user = self.request.user
        
        if user.rol.nombre in ['Administrador', 'Médico']:
            return MedicationInventory.objects.all()
        
        return MedicationInventory.objects.none()

    def get_permissions(self):
        user = self.request.user
        permission_classes = []
        
        if user.rol.nombre == 'Administrador':
            permission_classes = [IsAdmin]
        elif user.rol.nombre == 'Médico':
            if self.action in ['list']:
                permission_classes = [IsMedico]
        
        self.permission_classes = permission_classes
        return super().get_permissions()
    
 