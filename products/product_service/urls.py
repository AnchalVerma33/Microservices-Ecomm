from django.urls import path
from .viewsets import ProductViewSet

add_product = ProductViewSet.as_view({"post" : "add_product"})
get_product_list = ProductViewSet.as_view({"get" : "get_product_list"})
get_one_product = ProductViewSet.as_view({"get" : "get_one_product"})

urlpatterns = [
    path("add_product/", add_product , name="add_product"),
    path("get_product_list/", get_product_list , name="get_product_list"),
    path("get_one_product/", get_one_product , name="get_one_product"),
]