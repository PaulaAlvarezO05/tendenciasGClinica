from rest_framework import serializers 
from .models import * 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer): 

    class Meta: 
        model = User
        fields = ('id', 'username', 'nombres', 'apellidos', 'telefono', 'fecha_nacimiento', 'direccion', 'rol', 'especialidad', 'password')

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
        
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('nombres', 'apellidos', 'email', 'telefono', 'fecha_nacimiento', 'direccion', 'rol', 'especialidad') 
        
class UserTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        if user.rol:
            token['rol'] = user.rol.nombre
        
        return token