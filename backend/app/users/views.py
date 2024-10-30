from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from ..roles.permissions import *

class UserViewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:  
            return UserUpdateSerializer 
        return super().get_serializer_class()
    
    def get_queryset(self):
        user = self.request.user
        
        if user.rol.nombre == 'Administrador':
            return User.objects.all()
        
        if user.rol.nombre == 'Asistente Administrativo':
            return User.objects.filter(rol__nombre='Médico') | User.objects.filter(id=user.id)
        
        return User.objects.filter(id=user.id)


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

class UserTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    