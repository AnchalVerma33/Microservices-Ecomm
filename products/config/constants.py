import os
from dotenv import load_dotenv
load_dotenv()


env_constant = {
    "DBHOST" : os.getenv("DBHOST"),
    "DBNAME" : os.getenv("DBNAME"),
    "DBUSERNAME" : os.getenv("DBUSERNAME"),
    "DBPASSWORD" : os.getenv("DBPASSWORD"),
    "DBPORT" : os.getenv("DBPORT"),
    "REDIS_PORT" : os.getenv("REDIS_PORT"),
    "REDIS_HOST" : os.getenv("REDIS_HOST")
}