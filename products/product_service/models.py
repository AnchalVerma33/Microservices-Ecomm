from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone


class Product(models.Model):
    productID = models.CharField(max_length=255, primary_key=True, unique=True)
    productName = models.CharField(max_length=255)
    productImage = models.CharField(max_length=255, blank=True, null=True)
    productDescription = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
    currency = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Override save method to update 'updated_at' field on each save
        self.updated_at = timezone.now()
        super(Product, self).save(*args, **kwargs)
        
    class Meta:
        db_table = 'products'
