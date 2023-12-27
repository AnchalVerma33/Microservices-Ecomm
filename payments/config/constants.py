import os
from dotenv import load_dotenv
load_dotenv()


env_constant = {
    "RAZORPAY_API_KEY" : os.getenv("RAZORPAY_API_KEY"),
    "RAZORPAY_API_SECRET" : os.getenv("RAZORPAY_API_SECRET"),
}