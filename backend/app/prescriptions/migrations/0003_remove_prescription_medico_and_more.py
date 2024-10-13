# Generated by Django 5.1.1 on 2024-10-13 18:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medicalRecords', '0002_initial'),
        ('prescriptions', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='prescription',
            name='medico',
        ),
        migrations.RemoveField(
            model_name='prescription',
            name='paciente',
        ),
        migrations.AlterField(
            model_name='prescription',
            name='historia_clinica',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='medicalRecords.medicalrecord', verbose_name='Historia Clínica'),
        ),
    ]
