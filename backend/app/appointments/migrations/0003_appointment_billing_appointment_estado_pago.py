# Generated by Django 5.1.1 on 2024-10-27 20:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0002_initial'),
        ('billing', '0002_alter_billing_monto'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='billing',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='billing.billing'),
        ),
        migrations.AddField(
            model_name='appointment',
            name='estado_pago',
            field=models.CharField(default='Pendiente', max_length=20),
        ),
    ]
