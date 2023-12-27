from django.urls import path
from . import views


urlpatterns = [
    path("create_razorpay_order/", views.create_razorpay_order , name="create_razorpay_order"),
    path("verify_order/", views.verify_order , name="verify_order"),
]