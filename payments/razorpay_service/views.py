from django.shortcuts import render
from razorpay_service.service import RazorpayService
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json


@require_http_methods(["POST"])
@csrf_exempt
def create_razorpay_order(request):
    try:
        raw_data = request.body
        data = raw_data.decode("utf-8")
        options = json.loads(data)
        rzp_orders = RazorpayService().create_razorpay_order(options)
        return JsonResponse({'data' : rzp_orders}, status=200)
    except Exception as e:
         return JsonResponse({'error': str(e)}, status=500)
     
 
@require_http_methods(["POST"])
@csrf_exempt    
def verify_order(request):
    try:
        raw_data = request.body
        data = raw_data.decode("utf-8")
        options = json.loads(data)
        is_verified = RazorpayService().verify_order(options)

        if is_verified:
            return JsonResponse({'message': 'Payment verified successfully'})
        else:
            return JsonResponse({'error': 'Payment verification failed'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
     
     
    



