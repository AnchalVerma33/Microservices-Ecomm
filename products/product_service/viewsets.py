from rest_framework import viewsets, status
from rest_framework.response import Response
import json
from product_service.services import ProductService


class ProductViewSet(viewsets.ModelViewSet):
    
    def add_product(self,request):
        try:
            raw_data = request.body
            data = raw_data.decode("utf-8")
            data_json = json.loads(data)
            result = ProductService().add_product(data_json)
            return Response({'data':result,'success':True}, status=status.HTTP_201_CREATED)  
        except Exception as e:
            return Response(e,status=status.HTTP_400_BAD_REQUEST)
        
    
    def get_product_list(self,request):
        try:
            all_query = request.GET
            filters = dict()
            for key, value in all_query.items():
                filters[key] = value
            result = ProductService().get_product_list(filters)
            return Response({'data':result,'success':True}, status=status.HTTP_200_OK)  
        except Exception as e:
            return Response(e,status=status.HTTP_400_BAD_REQUEST)
        
        
    def get_one_product(self,request):
        try:
            all_query = request.GET
            filters = dict()
            for key, value in all_query.items():
                filters[key] = value
            result = ProductService().get_one_product(filters)
            return Response({'data':result,'success':True}, status=status.HTTP_200_OK)  
        except Exception as e:
            return Response(e,status=status.HTTP_400_BAD_REQUEST)
        
        
    def update_one_product(self,request,productID):
        try:
            raw_data = request.body
            data = raw_data.decode("utf-8")
            data_json = json.loads(data)
            result = ProductService().update_one_product(productID, data_json)
            return Response({'data':result,'success':True}, status=status.HTTP_200_OK)  
        except Exception as e:
            return Response(e,status=status.HTTP_400_BAD_REQUEST)
        
        
    def update_bulk_product(self,request):
        try:
            raw_data = request.body
            data = raw_data.decode("utf-8")
            data_json = json.loads(data)
            result = ProductService().update_bulk_product(data_json)
            return Response({'data':result,'success':True}, status=status.HTTP_200_OK)  
        except Exception as e:
            return Response(e,status=status.HTTP_400_BAD_REQUEST)
        
        
    def delete_product(self,request,productID):
        try:
            result = ProductService().delete_product(productID)
            return Response({'data':result,'success':True}, status=status.HTTP_200_OK)  
        except Exception as e:
            return Response(e,status=status.HTTP_400_BAD_REQUEST)
            
    
            
        
        