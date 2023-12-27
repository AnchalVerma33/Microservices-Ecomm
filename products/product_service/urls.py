from django.urls import path
from .viewsets import ProductViewSet

add_product = ProductViewSet.as_view({"post" : "add_product"})
get_product_list = ProductViewSet.as_view({"get" : "get_product_list"})
get_one_product = ProductViewSet.as_view({"get" : "get_one_product"})
update_one_product = ProductViewSet.as_view({"put" : "update_one_product"})
update_bulk_product = ProductViewSet.as_view({"put" : "update_bulk_product"})
delete_product = ProductViewSet.as_view({"delete" : "delete_product"})

urlpatterns = [
    path("add_product/", add_product , name="add_product"),
    path("get_product_list/", get_product_list , name="get_product_list"),
    path("get_one_product/", get_one_product , name="get_one_product"),
    path("update_one_product/<str:productID>/" , update_one_product , name="update_one_product"),
    path("update_bulk_product", update_bulk_product , name = "update_bulk_product"),
    path("delete_product/<str:productID>/", delete_product , name="delete_product"),
]