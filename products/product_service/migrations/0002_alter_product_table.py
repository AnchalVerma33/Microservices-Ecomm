# Generated by Django 5.0 on 2023-12-25 18:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product_service', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='product',
            table='products',
        ),
    ]