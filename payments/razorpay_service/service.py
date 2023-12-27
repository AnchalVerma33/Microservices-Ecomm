from razorpay import Client
from hashlib import sha256
from config.constants import env_constant
from rest_framework.exceptions import APIException

class RazorpayService:
    def __init__(self):
        self.api_key = env_constant["RAZORPAY_API_KEY"]
        self.api_secret = env_constant["RAZORPAY_API_SECRET"]
        self.client = Client(auth=(self.api_key, self.api_secret))

    def create_razorpay_order(self, options):
        try:
            order = self.client.order.create(options)
            return order
        except Exception as e:
            raise APIException(detail=str(e))

    def verify_order(self, options):
        try:
            order_id = options['order_id']
            razorpay_payment_id = options['razorpay_payment_id']
            razorpay_signature = options['razorpay_signature']

            generated_signature = sha256(f"{order_id}|{razorpay_payment_id}".encode()).hexdigest()
            print(generated_signature)
            
            if generated_signature == razorpay_signature:
                return True
            return False
        except Exception as e:
            raise APIException(detail=str(e))

    