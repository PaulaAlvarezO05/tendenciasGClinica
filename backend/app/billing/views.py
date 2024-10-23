from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *

class BillingViewset(viewsets.ModelViewSet):
    queryset = Billing.objects.all()
    serializer_class = BillingSerializer
    
