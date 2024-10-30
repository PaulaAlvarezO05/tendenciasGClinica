from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from ..roles.permissions import *

class MedicalRecordViewset(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        user = self.request.user

        if user.rol.nombre == 'Administrador':
            return MedicalRecord.objects.all()
        
        if user.rol.nombre == 'Médico':
            return MedicalRecord.objects.all()  

        return MedicalRecord.objects.none()

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
