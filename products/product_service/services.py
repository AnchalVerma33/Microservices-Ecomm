from product_service.models import Product
from utils.service import Utils

class ProductService:
    def __init__(self) -> None:
        self.product = Product
        
    def add_product(self,product_data):
        product_data["productID"] = Utils.generate_uuid()
        new_product = Product.add_product(product_data)
        return new_product
    
    def get_product_list(self, filter):
        product_list = Product.get_product_list(filter)
        return product_list
    
    def get_one_product(self, filter):
        product = Product.get_one_product(filter)
        return product
    
    def update_one_product(self, productID , update_prod_data):
        updated_data = Product.update_one_product(productID, update_prod_data)
        return updated_data
    
    
    def update_bulk_product(self, update_prod_data):
        updated_data = Product.update_bulk_product(update_prod_data)
        return updated_data
    
    def delete_product(self, productID):
        deleted_product = Product. delete_product(productID)
        return deleted_product
        
        


