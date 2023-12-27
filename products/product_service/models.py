from django.db import models,transaction
from django.core.validators import MinValueValidator
from django.forms.models import model_to_dict
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
        
    def to_dict(self):
        return model_to_dict(self)
        
    
    @classmethod
    def return_meta_fields(cls):
        fields = [key.name for key in cls._meta.get_fields()]
        return fields
    

    @classmethod
    def add_product(cls, product_data):
        product = cls(
            productID=product_data.get('productID'),
            productName=product_data.get('productName'),
            productImage=product_data.get('productImage'),
            productDescription=product_data.get('productDescription'),
            price=product_data.get('price'),
            quantity=product_data.get('quantity'),
            currency=product_data.get('currency'),
        )
        product.save()
        return product.to_dict()
    
    @classmethod
    def get_product_list(cls, filters):
        new_filters = dict()
        fields = cls.return_meta_fields()
        for key in filters:
            if key in fields:
                new_filters[key] = filters[key] 
        product_list = cls.objects.filter(**new_filters)
        return product_list.values()
    
    @classmethod
    def get_one_product(cls, filters):
        new_filters = dict()
        fields = cls.return_meta_fields()
        for key in filters:
            if key in fields:
                new_filters[key] = filters[key] 
        product_queryset = cls.objects.filter(**new_filters)
        if product_queryset.exists() and product_queryset.count()>0:
            return product_queryset.first().to_dict()
        return dict()
    
    @classmethod
    def update_one_product(cls, productID, updated_values):
        fields = cls.return_meta_fields() 
        product_obj = cls.objects.get(productID=productID)
        for key in updated_values:
            if key in fields:
                setattr(product_obj,key,updated_values[key])
        product_obj.save()
        updated_product = cls.objects.get(productID=productID)
        return updated_product.to_dict()
    
    
    @classmethod
    def update_bulk_product(cls, updated_values_list):
        product_ids = list()
        products_updated_list = list()
        fields_to_update = set()
        fields = cls.return_meta_fields() 
        for update_data in updated_values_list:
            productID = update_data.get("productID")
            if not productID:
                continue
            product_ids.append(productID)
            product_obj = cls.objects.get(productID=productID)
            for key in update_data:
                if key in fields and key != "productID":
                    fields_to_update.add(key)
                    setattr(product_obj, key, update_data[key])

            products_updated_list.append(product_obj)
        print(list(fields_to_update))
        with transaction.atomic():
            cls.objects.bulk_update(products_updated_list,list(fields_to_update))
        
        new_updated_data = cls.objects.filter(productID__in=product_ids)
        return new_updated_data.values()
    
    @classmethod
    def delete_product(cls, productID):
        product = cls.objects.get(productID=productID)
        product.delete()
        return {"message" : f"Product deleted for productID : {productID}"}
            
        
            
        
            
        
        
        
    
        
