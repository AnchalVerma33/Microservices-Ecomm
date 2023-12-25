# Generated by Django 5.0 on 2023-12-25 18:44

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('productID', models.CharField(max_length=255, primary_key=True, serialize=False, unique=True)),
                ('productName', models.CharField(max_length=255)),
                ('productImage', models.CharField(blank=True, max_length=255, null=True)),
                ('productDescription', models.TextField(blank=True, null=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quantity', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('currency', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
